import axios from "axios";
import {store} from "../stores/stores";

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  maxRequests: 5,
  windowMs: 60 * 1000
};

let requestCount = 0;
let lastRequestTime = Date.now();

export const roomApi = axios.create({
  baseURL: "/api/v1/rooms",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

// Request interceptor for rate limiting
roomApi.interceptors.request.use(async config => {
  const now = Date.now();
  const elapsed = now - lastRequestTime;

  if (elapsed > RATE_LIMIT_CONFIG.windowMs) {
    requestCount = 0;
    lastRequestTime = now;
  }

  if (requestCount >= RATE_LIMIT_CONFIG.maxRequests) {
    const delay = RATE_LIMIT_CONFIG.windowMs - elapsed;
    await new Promise(resolve => setTimeout(resolve, delay));
    requestCount = 0;
    lastRequestTime = Date.now();
  }

  requestCount++;
  return config;
}, error => {
  return Promise.reject(error);
});

// Response interceptor to handle token refresh
roomApi.interceptors.response.use(response => response, async error => {
  const originalRequest = error.config;

  if (
    error.response
    ?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;

    try {
      const {refreshToken} = store.getState().user;
      if (!refreshToken) 
        throw new Error("No refresh token");
      
      const {data} = await roomApi.post("/refresh-token", {refreshToken});
      store.dispatch(setAuthTokens({accessToken: data.data.accessToken, refreshToken: data.data.refreshToken}));

      originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
      return roomApi(originalRequest);
    } catch (err) {
      store.dispatch(logoutUsers());
      return Promise.reject(err);
    }
  }

  return Promise.reject(error);
});

/**
 * Create a new room
 * @param {Object} roomData - Room data including service, name, roomType, etc.
 * @returns {Object} Response object with success status, data, and message
 */
export const createRoom = async roomData => {
  console.log("Received room data:", JSON.stringify(roomData, null, 2));

  try {
    // Validate required fields
    if (!roomData.service || !roomData.name || !roomData.roomType || !roomData.pricePerNight || !roomData.capacity) {
      throw new Error("Service, name, roomType, pricePerNight, and capacity are required fields");
    }

    //  Validate room type
    // const validRoomTypes = [
    //   "single",
    //   "double",
    //   "twin",
    //   "triple",
    //   "queen",
    //   "king",
    //   "family",
    //   "suite",
    //   "presidential",
    //   "dormitory",
    //   "cottage",
    //   "tent",
    //   "penthouse",
    //   "honeymoon",
    //   "studio",
    //   "shared",
    //   "private",
    //   "entire_home",
    //   "other"
    // ];
    // if (!validRoomTypes.includes(roomData.roomType)) {
    //   throw new Error(`Invalid room type. Allowed types: ${validRoomTypes.join(", ")}`);
    // }

    // Validate price per night
    if (roomData.pricePerNight < 0) {
      throw new Error("Price per night cannot be negative");
    }

    // Validate capacity
    if (roomData.capacity < 1) {
      throw new Error("Capacity must be at least 1");
    }

    const response = await roomApi.post("/", roomData);

    if (
      !response.data
      ?.success) {
      throw new Error(
        response.data
        ?.message || "Invalid response structure");
    }

    return {
      success: true,
      data: response.data.data,
      message: response.data.message || "Room created successfully",
      statusCode: response.status
    };
  } catch (error) {
    let errorMessage = "Failed to create room";

    if (error.response) {
      if (error.response.status === 400) {
        errorMessage = error.response.data
          ?.message || "Validation failed";
      } else if (error.response.status === 401) {
        errorMessage = "Authentication required";
      } else if (error.response.status === 403) {
        errorMessage = "Not authorized to create room";
      } else if (error.response.status === 409) {
        errorMessage = "Room with this name already exists";
      } else {
        errorMessage = error.response.data
          ?.message || error.response.statusText || `Server error (${error.response.status})`;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

/**
 * Update a room
 * @param {String} id - Room ID
 * @param {Object} updateData - Data to update
 * @returns {Object} Response object with success status, data, and message
 */
export const updateRoom = async (id, updateData) => {
  try {
    if (!id) 
      throw new Error("Room ID is required");
    
    // Validate room type if provided
    if (updateData.roomType) {
      const validRoomTypes = ["single", "double", "suite", "other"];
      if (!validRoomTypes.includes(updateData.roomType)) {
        throw new Error(`Invalid room type. Allowed types: ${validRoomTypes.join(", ")}`);
      }
    }

    // Validate price per night if provided
    if (updateData.pricePerNight && updateData.pricePerNight < 0) {
      throw new Error("Price per night cannot be negative");
    }

    // Validate capacity if provided
    if (updateData.capacity && updateData.capacity < 1) {
      throw new Error("Capacity must be at least 1");
    }

    // Check for duplicate name if name is being updated
    if (updateData.name) {
      const response = await roomApi.get(`/?name=${updateData.name}`);
      if (
        response.data
        ?.data
          ?.some(room => room._id !== id && room.name === updateData.name)) {
        throw new Error("A room with this name already exists");
      }
    }

    const response = await roomApi.patch(`/${id}`, updateData);

    if (
      !response.data
      ?.success) {
      throw new Error(
        response.data
        ?.message || "Invalid response structure");
    }

    return {
      success: true,
      data: response.data.data,
      message: response.data.message || "Room updated successfully",
      statusCode: response.status
    };
  } catch (error) {
    let errorMessage = "Failed to update room";

    if (error.response) {
      if (error.response.status === 400) {
        errorMessage = error.response.data
          ?.message || "Validation failed";
      } else if (error.response.status === 401) {
        errorMessage = "Authentication required";
      } else if (error.response.status === 403) {
        errorMessage = "Not authorized to update this room";
      } else if (error.response.status === 404) {
        errorMessage = "Room not found";
      } else {
        errorMessage = error.response.data
          ?.message || error.response.statusText || `Server error (${error.response.status})`;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

/**
 * Delete a room
 * @param {String} id - Room ID
 * @returns {Object} Response object with success status and message
 */
export const deleteRoom = async id => {
  try {
    if (!id) 
      throw new Error("Room ID is required");
    
    const response = await roomApi.delete(`/${id}`);

    if (
      !response.data
      ?.success) {
      throw new Error(
        response.data
        ?.message || "Invalid response structure");
    }

    return {
      success: true,
      message: response.data.message || "Room deleted successfully",
      statusCode: response.status
    };
  } catch (error) {
    let errorMessage = "Failed to delete room";

    if (error.response) {
      if (error.response.status === 401) {
        errorMessage = "Authentication required";
      } else if (error.response.status === 403) {
        errorMessage = "Not authorized to delete this room";
      } else if (error.response.status === 404) {
        errorMessage = "Room not found";
      } else {
        errorMessage = error.response.data
          ?.message || error.response.statusText || `Server error (${error.response.status})`;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

/**
 * Get all rooms with optional filters
 * @param {Object} filters - Optional filters (service, roomType, minPrice, maxPrice, etc.)
 * @returns {Object} Response object with success status, data, and message
 */
export const getAllRooms = async (filters = {}) => {
  try {
    const response = await roomApi.get("/", {params: filters});

    if (
      !response.data
      ?.success) {
      throw new Error(
        response.data
        ?.message || "Invalid response structure");
    }

    return {
      success: true,
      data: response.data.data,
      message: response.data.message || "Rooms fetched successfully",
      statusCode: response.status
    };
  } catch (error) {
    let errorMessage = "Failed to fetch rooms";

    if (error.response) {
      if (error.response.status === 400) {
        errorMessage = error.response.data
          ?.message || "Invalid filters";
      } else {
        errorMessage = error.response.data
          ?.message || error.response.statusText || `Server error (${error.response.status})`;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

/**
 * Get a room by ID
 * @param {String} id - Room ID
 * @returns {Object} Response object with success status, data, and message
 */
export const getRoomById = async id => {
  try {
    if (!id) 
      throw new Error("Room ID is required");
    
    const response = await roomApi.get(`/${id}`);

    if (
      !response.data
      ?.success) {
      throw new Error(
        response.data
        ?.message || "Invalid response structure");
    }

    return {
      success: true,
      data: response.data.data,
      message: response.data.message || "Room fetched successfully",
      statusCode: response.status
    };
  } catch (error) {
    let errorMessage = "Failed to fetch room";

    if (error.response) {
      if (error.response.status === 404) {
        errorMessage = "Room not found";
      } else {
        errorMessage = error.response.data
          ?.message || error.response.statusText || `Server error (${error.response.status})`;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

/**
 * Get rooms by service ID
 * @param {String} serviceId - Service ID
 * @returns {Object} Response object with success status, data, and message
 */
export const getRoomsByService = async serviceId => {
  try {
    if (!serviceId) 
      throw new Error("Service ID is required");
    
    const response = await roomApi.get(`/service/${serviceId}`);

    if (
      !response.data
      ?.success) {
      throw new Error(
        response.data
        ?.message || "Invalid response structure");
    }

    return {
      success: true,
      data: response.data.data,
      message: response.data.message || "Rooms fetched successfully",
      statusCode: response.status
    };
  } catch (error) {
    let errorMessage = "Failed to fetch rooms by service";

    if (error.response) {
      if (error.response.status === 404) {
        errorMessage = "Service not found";
      } else {
        errorMessage = error.response.data
          ?.message || error.response.statusText || `Server error (${error.response.status})`;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

/**
 * Get rooms by room type
 * @param {String} roomType - Room type (single, double, suite, other)
 * @returns {Object} Response object with success status, data, and message
 */
export const getRoomsByType = async roomType => {
  try {
    if (!roomType) 
      throw new Error("Room type is required");
    
    const validRoomTypes = ["single", "double", "suite", "other"];
    if (!validRoomTypes.includes(roomType)) {
      throw new Error(`Invalid room type. Allowed types: ${validRoomTypes.join(", ")}`);
    }

    const response = await roomApi.get(`/type/${roomType}`);

    if (
      !response.data
      ?.success) {
      throw new Error(
        response.data
        ?.message || "Invalid response structure");
    }

    return {
      success: true,
      data: response.data.data,
      message: response.data.message || "Rooms fetched successfully",
      statusCode: response.status
    };
  } catch (error) {
    let errorMessage = "Failed to fetch rooms by type";

    if (error.response) {
      errorMessage = error.response.data
        ?.message || error.response.statusText || `Server error (${error.response.status})`;
    } else if (error.message) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

/**
 * Upload images for a room
 * @param {String} id - Room ID
 * @param {Array<File>} images - Array of image files
 * @returns {Object} Response object with success status, data, and message
 */
export const uploadRoomImages = async (id, images) => {
  try {
    if (!id) 
      throw new Error("Room ID is required");
    if (!images || images.length === 0) 
      throw new Error("At least one image is required");
    
    const formData = new FormData();
    images.forEach(image => {
      formData.append("images", image);
    });

    const response = await roomApi.post(`/${id}/images`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    if (
      !response.data
      ?.success) {
      throw new Error(
        response.data
        ?.message || "Invalid response structure");
    }

    return {
      success: true,
      data: response.data.data,
      message: response.data.message || "Images uploaded successfully",
      statusCode: response.status
    };
  } catch (error) {
    let errorMessage = "Failed to upload images";

    if (error.response) {
      if (error.response.status === 400) {
        errorMessage = error.response.data
          ?.message || "Invalid image format";
      } else if (error.response.status === 401) {
        errorMessage = "Authentication required";
      } else if (error.response.status === 403) {
        errorMessage = "Not authorized to upload images for this room";
      } else if (error.response.status === 404) {
        errorMessage = "Room not found";
      } else {
        errorMessage = error.response.data
          ?.message || error.response.statusText || `Server error (${error.response.status})`;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

/**
 * Update images for a room (replace existing images)
 * @param {String} id - Room ID
 * @param {Array<File>} images - Array of image files
 * @returns {Object} Response object with success status, data, and message
 */
export const updateRoomImages = async (id, images) => {
  try {
    if (!id) 
      throw new Error("Room ID is required");
    if (!images || images.length === 0) 
      throw new Error("At least one image is required");
    
    const formData = new FormData();
    images.forEach(image => {
      formData.append("images", image);
    });

    const response = await roomApi.patch(`/${id}/images`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    if (
      !response.data
      ?.success) {
      throw new Error(
        response.data
        ?.message || "Invalid response structure");
    }

    return {
      success: true,
      data: response.data.data,
      message: response.data.message || "Images updated successfully",
      statusCode: response.status
    };
  } catch (error) {
    let errorMessage = "Failed to update images";

    if (error.response) {
      if (error.response.status === 400) {
        errorMessage = error.response.data
          ?.message || "Invalid image format";
      } else if (error.response.status === 401) {
        errorMessage = "Authentication required";
      } else if (error.response.status === 403) {
        errorMessage = "Not authorized to update images for this room";
      } else if (error.response.status === 404) {
        errorMessage = "Room not found";
      } else {
        errorMessage = error.response.data
          ?.message || error.response.statusText || `Server error (${error.response.status})`;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

/**
 * Upload accommodation images for a room (add to existing images)
 * @param {String} id - Room ID
 * @param {Array<File>} images - Array of image files
 * @returns {Object} Response object with success status, data, and message
 */
export const uploadAccommodationImages = async (id, images) => {
  try {
    if (!id) 
      throw new Error("Room ID is required");
    if (!images || images.length === 0) 
      throw new Error("At least one image is required");
    
    const formData = new FormData();
    images.forEach(image => {
      formData.append("images", image);
    });

    const response = await roomApi.post(`/${id}/accomodation_images`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    if (
      !response.data
      ?.success) {
      throw new Error(
        response.data
        ?.message || "Invalid response structure");
    }

    return {
      success: true,
      data: response.data.data,
      message: response.data.message || "Accommodation images uploaded successfully",
      statusCode: response.status
    };
  } catch (error) {
    let errorMessage = "Failed to upload accommodation images";

    if (error.response) {
      if (error.response.status === 400) {
        errorMessage = error.response.data
          ?.message || "Invalid image format";
      } else if (error.response.status === 401) {
        errorMessage = "Authentication required";
      } else if (error.response.status === 403) {
        errorMessage = "Not authorized to upload accommodation images for this room";
      } else if (error.response.status === 404) {
        errorMessage = "Room not found";
      } else {
        errorMessage = error.response.data
          ?.message || error.response.statusText || `Server error (${error.response.status})`;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

/**
 * Update accommodation images for a room (replace existing images)
 * @param {String} id - Room ID
 * @param {Array<File>} images - Array of image files
 * @returns {Object} Response object with success status, data, and message
 */
export const updateAccommodationImages = async (id, images) => {
  try {
    if (!id) 
      throw new Error("Room ID is required");
    if (!images || images.length === 0) 
      throw new Error("At least one image is required");
    
    const formData = new FormData();
    images.forEach(image => {
      formData.append("images", image);
    });

    const response = await roomApi.patch(`/${id}/accomodation_images`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    if (
      !response.data
      ?.success) {
      throw new Error(
        response.data
        ?.message || "Invalid response structure");
    }

    return {
      success: true,
      data: response.data.data,
      message: response.data.message || "Accommodation images updated successfully",
      statusCode: response.status
    };
  } catch (error) {
    let errorMessage = "Failed to update accommodation images";

    if (error.response) {
      if (error.response.status === 400) {
        errorMessage = error.response.data
          ?.message || "Invalid image format";
      } else if (error.response.status === 401) {
        errorMessage = "Authentication required";
      } else if (error.response.status === 403) {
        errorMessage = "Not authorized to update accommodation images for this room";
      } else if (error.response.status === 404) {
        errorMessage = "Room not found";
      } else {
        errorMessage = error.response.data
          ?.message || error.response.statusText || `Server error (${error.response.status})`;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};