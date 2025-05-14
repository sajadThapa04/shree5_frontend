import axios from "axios";

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  maxRequests: 5, // Max requests per window
  windowMs: 60 * 1000 // 1 minute window
};

let requestCount = 0;
let lastRequestTime = Date.now();

export const restaurantApi = axios.create({
  baseURL: "/api/v1/restaurants",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

// Add request interceptor for rate limiting
restaurantApi.interceptors.request.use(async config => {
  const now = Date.now();
  const elapsed = now - lastRequestTime;

  // Reset counter if window has passed
  if (elapsed > RATE_LIMIT_CONFIG.windowMs) {
    requestCount = 0;
    lastRequestTime = now;
  }

  // If we've exceeded the rate limit, delay the request
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

/**
 * Create a new restaurant
 * @param {Object} restaurantData - Restaurant data including service, name, cuisineDetails, etc.
 * @returns {Object} Response object with success status, data, and message
 */
export const createRestaurant = async restaurantData => {
  try {
    // console.log("Received restaurant data:", JSON.stringify(restaurantData, null, 2));

    const {cuisineDetails, seatingCapacity, openingHours, service} = restaurantData;

    // Validate required fields
    if (!cuisineDetails || !seatingCapacity || !openingHours || !service) {
      throw new Error("All required fields must be provided");
    }

    // Validate cuisineDetails array
    if (!Array.isArray(cuisineDetails) || cuisineDetails.length === 0) {
      throw new Error("At least one cuisine detail is required");
    }

    // Validate each cuisine detail
    for (const cuisine of cuisineDetails) {
      if (!cuisine.name || !cuisine.price) {
        throw new Error("Each cuisine must have a name and price");
      }
      if (cuisine.price < 0) {
        throw new Error("Cuisine price cannot be negative");
      }
      if (cuisine.image && !/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$/i.test(cuisine.image)) {
        throw new Error("Cuisine image URL must be valid image URL");
      }
    }

    // Validate seating capacity
    if (seatingCapacity < 1) {
      throw new Error("Seating capacity must be at least 1");
    }

    // Validate openingHours structure
    const days = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday"
    ];
    const daysInRequest = new Set();

    if (!Array.isArray(openingHours) || openingHours.length === 0) {
      throw new Error("Opening hours are required for all days");
    }

    for (const day of openingHours) {
      if (!days.includes(day.day)) {
        throw new Error(`Invalid day: ${day.day}`);
      }

      if (!Array.isArray(day.timeSlots) || day.timeSlots.length === 0) {
        throw new Error(`At least one time slot is required for ${day.day}`);
      }

      for (const slot of day.timeSlots) {
        if (!slot.openingTime || !slot.closingTime) {
          throw new Error(`Both opening and closing times are required for ${day.day}`);
        }

        if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(slot.openingTime) || !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(slot.closingTime)) {
          throw new Error(`Times for ${day.day} must be in valid HH:mm format`);
        }
      }
      daysInRequest.add(day.day);
    }

    // Check all days are present
    if (daysInRequest.size !== days.length) {
      const missingDays = days.filter(day => !daysInRequest.has(day));
      throw new Error(`Missing opening hours for: ${missingDays.join(", ")}`);
    }

    // Prepare request data
    const requestData = {
      cuisineDetails,
      seatingCapacity,
      openingHours,
      amenities: restaurantData.amenities || [],
      isAvailable: restaurantData.isAvailable !== false,
      service
    };

    const response = await restaurantApi.post("/", requestData);

    if (!response.data) {
      throw new Error("Invalid response from server");
    }

    return {
      success: true,
      data: response.data.data,
      message: response.data.message || "Restaurant created successfully"
    };
  } catch (error) {
    let errorMessage = "Failed to create restaurant";

    if (error.response) {
      // Handle structured backend errors
      if (
        error.response.data
        ?.message) {
        errorMessage = error.response.data.message;
      } else {
        errorMessage = error.response.statusText || `Server error (${error.response.status})`;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

/**
 * Update a restaurant
 * @param {String} id - Restaurant ID
 * @param {Object} updateData - Data to update
 * @returns {Object} Response object with success status, data, and message
 */
export const updateRestaurant = async (id, updateData) => {
  try {
    if (!id) 
      throw new Error("Restaurant ID is required");
    
    // Validate cuisineDetails if provided
    if (updateData.cuisineDetails) {
      if (!Array.isArray(updateData.cuisineDetails)) {
        throw new Error("Cuisine details must be an array");
      }
      for (const cuisine of updateData.cuisineDetails) {
        if (!cuisine.name || !cuisine.price) {
          throw new Error("Each cuisine must have a name and price");
        }
        if (cuisine.price < 0) {
          throw new Error("Cuisine price cannot be negative");
        }
      }
    }

    // Validate seating capacity if provided
    if (updateData.seatingCapacity && updateData.seatingCapacity < 1) {
      throw new Error("Seating capacity must be at least 1");
    }

    const response = await restaurantApi.patch(`/${id}`, updateData);

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
      message: response.data.message || "Restaurant updated successfully",
      statusCode: response.status
    };
  } catch (error) {
    let errorMessage = "Failed to update restaurant";

    if (error.response) {
      if (error.response.status === 400) {
        errorMessage = error.response.data
          ?.message || "Validation failed";
      } else if (error.response.status === 401) {
        errorMessage = "Authentication required";
      } else if (error.response.status === 403) {
        errorMessage = "Not authorized to update this restaurant";
      } else if (error.response.status === 404) {
        errorMessage = "Restaurant not found";
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
 * Delete a restaurant
 * @param {String} id - Restaurant ID
 * @returns {Object} Response object with success status and message
 */
export const deleteRestaurant = async id => {
  try {
    if (!id) 
      throw new Error("Restaurant ID is required");
    
    const response = await restaurantApi.delete(`/${id}`);

    if (
      !response.data
      ?.success) {
      throw new Error(
        response.data
        ?.message || "Invalid response structure");
    }

    return {
      success: true,
      message: response.data.message || "Restaurant deleted successfully",
      statusCode: response.status
    };
  } catch (error) {
    let errorMessage = "Failed to delete restaurant";

    if (error.response) {
      if (error.response.status === 401) {
        errorMessage = "Authentication required";
      } else if (error.response.status === 403) {
        errorMessage = "Not authorized to delete this restaurant";
      } else if (error.response.status === 404) {
        errorMessage = "Restaurant not found";
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
 * Get all restaurants with optional filters
 * @param {Object} filters - Optional filters (service, cuisineName, minPrice, maxPrice, etc.)
 * @returns {Object} Response object with success status, data, and message
 */
export const getAllRestaurants = async (filters = {}) => {
  try {
    const response = await restaurantApi.get("/", {params: filters});

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
      message: response.data.message || "Restaurants fetched successfully",
      statusCode: response.status
    };
  } catch (error) {
    let errorMessage = "Failed to fetch restaurants";

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
 * Get a restaurant by ID
 * @param {String} id - Restaurant ID
 * @returns {Object} Response object with success status, data, and message
 */
export const getRestaurantById = async id => {
  try {
    if (!id) 
      throw new Error("Restaurant ID is required");
    
    const response = await restaurantApi.get(`/${id}`);

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
      message: response.data.message || "Restaurant fetched successfully",
      statusCode: response.status
    };
  } catch (error) {
    let errorMessage = "Failed to fetch restaurant";

    if (error.response) {
      if (error.response.status === 404) {
        errorMessage = "Restaurant not found";
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
 * Get restaurants by service ID
 * @param {String} serviceId - Service ID
 * @returns {Object} Response object with success status, data, and message
 */
export const getRestaurantsByService = async serviceId => {
  try {
    if (!serviceId) 
      throw new Error("Service ID is required");
    
    const response = await restaurantApi.get(`/service/${serviceId}`);

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
      message: response.data.message || "Restaurants fetched successfully",
      statusCode: response.status
    };
  } catch (error) {
    let errorMessage = "Failed to fetch restaurants by service";

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
 * Upload images for a restaurant
 * @param {String} id - Restaurant ID
 * @param {Array<File>} images - Array of image files
 * @returns {Object} Response object with success status, data, and message
 */
export const uploadRestaurantImages = async (id, images) => {
  try {
    if (!id) 
      throw new Error("Restaurant ID is required");
    if (!images || images.length === 0) 
      throw new Error("At least one image is required");
    
    const formData = new FormData();
    images.forEach(image => {
      formData.append("images", image);
    });

    const response = await restaurantApi.post(`/${id}/images`, formData, {
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
        errorMessage = "Not authorized to upload images for this restaurant";
      } else if (error.response.status === 404) {
        errorMessage = "Restaurant not found";
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
 * Update images for a restaurant (replace existing images)
 * @param {String} id - Restaurant ID
 * @param {Array<File>} images - Array of image files
 * @returns {Object} Response object with success status, data, and message
 */
export const updateRestaurantImages = async (id, images) => {
  try {
    if (!id) 
      throw new Error("Restaurant ID is required");
    if (!images || images.length === 0) 
      throw new Error("At least one image is required");
    
    const formData = new FormData();
    images.forEach(image => {
      formData.append("images", image);
    });

    const response = await restaurantApi.patch(`/${id}/images`, formData, {
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
        errorMessage = "Not authorized to update images for this restaurant";
      } else if (error.response.status === 404) {
        errorMessage = "Restaurant not found";
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
 * Upload image for a specific cuisine item in a restaurant
 * @param {String} restaurantId - Restaurant ID
 * @param {String} cuisineId - Cuisine item ID
 * @param {File} image - Image file
 * @returns {Object} Response object with success status, data, and message
 */
export const uploadCuisineImage = async (restaurantId, cuisineId, image) => {
  try {
    if (!restaurantId || !cuisineId) {
      throw new Error("Restaurant ID and cuisine ID are required");
    }
    if (!image) {
      throw new Error("Image file is required");
    }

    const formData = new FormData();
    formData.append("image", image);

    const response = await restaurantApi.post(`/${restaurantId}/cuisine/${cuisineId}/image`, formData, {
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
      message: response.data.message || "Cuisine image uploaded successfully",
      statusCode: response.status
    };
  } catch (error) {
    let errorMessage = "Failed to upload cuisine image";

    if (error.response) {
      if (error.response.status === 400) {
        errorMessage = error.response.data
          ?.message || "Invalid image format";
      } else if (error.response.status === 401) {
        errorMessage = "Authentication required";
      } else if (error.response.status === 403) {
        errorMessage = "Not authorized to upload images for this restaurant";
      } else if (error.response.status === 404) {
        errorMessage = "Restaurant or cuisine item not found";
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
 * Delete image for a specific cuisine item in a restaurant
 * @param {String} restaurantId - Restaurant ID
 * @param {String} cuisineId - Cuisine item ID
 * @returns {Object} Response object with success status and message
 */
export const deleteCuisineImage = async (restaurantId, cuisineId) => {
  try {
    if (!restaurantId || !cuisineId) {
      throw new Error("Restaurant ID and cuisine ID are required");
    }

    const response = await restaurantApi.delete(`/${restaurantId}/cuisine/${cuisineId}/image`);

    if (
      !response.data
      ?.success) {
      throw new Error(
        response.data
        ?.message || "Invalid response structure");
    }

    return {
      success: true,
      message: response.data.message || "Cuisine image deleted successfully",
      statusCode: response.status
    };
  } catch (error) {
    let errorMessage = "Failed to delete cuisine image";

    if (error.response) {
      if (error.response.status === 401) {
        errorMessage = "Authentication required";
      } else if (error.response.status === 403) {
        errorMessage = "Not authorized to delete images for this restaurant";
      } else if (error.response.status === 404) {
        errorMessage = "Restaurant or cuisine item not found";
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