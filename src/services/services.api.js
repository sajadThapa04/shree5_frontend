import axios from "axios";

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  maxRequests: 5,
  windowMs: 60 * 1000
};

let requestCount = 0;
let lastRequestTime = Date.now();

export const serviceApi = axios.create({
  baseURL: "/api/v1/services",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

// Request interceptor for rate limiting
serviceApi.interceptors.request.use(async config => {
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

/**
 * Create a new service
 * @param {Object} serviceData - Service data including name, type, coordinates
 * @returns {Object} Response object with success status, data, and message
 */
export const createService = async serviceData => {
  try {
    // Validate required fields
    if (!serviceData.name || !serviceData.type || !serviceData.coordinates) {
      throw new Error("Name, type, and coordinates are required fields");
    }

    // Validate service type
    const allowedTypes = [
      "restaurant",
      "hotel",
      "lodge",
      "home_stay",
      "luxury_villa",
      "other"
    ];
    if (!allowedTypes.includes(serviceData.type)) {
      throw new Error(`Invalid service type. Allowed types: ${allowedTypes.join(", ")}`);
    }

    // Validate coordinates
    if (!Array.isArray(serviceData.coordinates) || serviceData.coordinates.length !== 2 || !serviceData.coordinates.every(coord => typeof coord === "number")) {
      throw new Error("Coordinates must be an array of [longitude, latitude]");
    }

    const [longitude, latitude] = serviceData.coordinates;
    if (longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) {
      throw new Error("Invalid coordinates. Longitude must be between -180 and 180, and latitude between -90 and 90");
    }

    const response = await serviceApi.post("/", serviceData);

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
      message: response.data.message || "Service created successfully",
      statusCode: response.status
    };
  } catch (error) {
    let errorMessage = "Failed to create service";

    if (error.response) {
      if (error.response.status === 400) {
        errorMessage = error.response.data
          ?.message || "Validation failed";
      } else if (error.response.status === 401) {
        errorMessage = "Authentication required";
      } else if (error.response.status === 403) {
        errorMessage = "Not authorized to create service";
      } else if (error.response.status === 409) {
        errorMessage = "Service with this name already exists";
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
 * Update a service
 * @param {String} id - Service ID
 * @param {Object} updateData - Data to update
 * @returns {Object} Response object with success status, data, and message
 */
export const updateService = async (id, updateData) => {
  try {
    if (!id) 
      throw new Error("Service ID is required");
    
    // Validate service type if provided
    if (updateData.type) {
      const allowedTypes = [
        "restaurant",
        "hotel",
        "lodge",
        "home_stay",
        "luxury_villa",
        "other"
      ];
      if (!allowedTypes.includes(updateData.type)) {
        throw new Error(`Invalid service type. Allowed types: ${allowedTypes.join(", ")}`);
      }
    }

    // Validate coordinates if provided
    if (updateData.coordinates) {
      if (!Array.isArray(updateData.coordinates) || updateData.coordinates.length !== 2 || !updateData.coordinates.every(coord => typeof coord === "number")) {
        throw new Error("Coordinates must be an array of [longitude, latitude]");
      }

      const [longitude, latitude] = updateData.coordinates;
      if (longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) {
        throw new Error("Invalid coordinates. Longitude must be between -180 and 180, and latitude between -90 and 90");
      }
    }

    const response = await serviceApi.patch(`/${id}`, updateData);

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
      message: response.data.message || "Service updated successfully",
      statusCode: response.status
    };
  } catch (error) {
    let errorMessage = "Failed to update service";

    if (error.response) {
      if (error.response.status === 400) {
        errorMessage = error.response.data
          ?.message || "Validation failed";
      } else if (error.response.status === 401) {
        errorMessage = "Authentication required";
      } else if (error.response.status === 403) {
        errorMessage = "Not authorized to update this service";
      } else if (error.response.status === 404) {
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
 * Delete a service
 * @param {String} id - Service ID
 * @returns {Object} Response object with success status and message
 */
export const deleteService = async id => {
  try {
    if (!id) 
      throw new Error("Service ID is required");
    
    const response = await serviceApi.delete(`/${id}`);

    if (
      !response.data
      ?.success) {
      throw new Error(
        response.data
        ?.message || "Invalid response structure");
    }

    return {
      success: true,
      message: response.data.message || "Service deleted successfully",
      statusCode: response.status
    };
  } catch (error) {
    let errorMessage = "Failed to delete service";

    if (error.response) {
      if (error.response.status === 401) {
        errorMessage = "Authentication required";
      } else if (error.response.status === 403) {
        errorMessage = "Not authorized to delete this service";
      } else if (error.response.status === 404) {
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
 * Get services for a specific host
 * @param {String} hostId - Host ID
 * @returns {Object} Response object with success status, data, and message
 */
export const getServicesForHost = async hostId => {
  try {
    if (!hostId) 
      throw new Error("Host ID is required");
    
    const response = await serviceApi.get(`/host/${hostId}/services`);

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
      message: response.data.message || "Services fetched successfully",
      statusCode: response.status
    };
  } catch (error) {
    let errorMessage = "Failed to fetch services for host";

    if (error.response) {
      if (error.response.status === 404) {
        errorMessage = "Host not found";
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
 * Get all service names (public endpoint)
 * @returns {Object} Response object with success status, data (array of services), and message
 */
export const getServiceNames = async () => {
  try {
    const response = await serviceApi.get("/public/names");

    if (
      !response.data
      ?.success) {
      throw new Error(
        response.data
        ?.message || "Invalid response structure");
    }

    return {
      success: true, data: response.data.data, // Array of service objects with name, type, _id
      message: response.data.message || "Service names fetched successfully",
      statusCode: response.status
    };
  } catch (error) {
    let errorMessage = "Failed to fetch service names";

    if (error.response) {
      errorMessage = error.response.data
        ?.message || error.response.statusText || `Server error (${error.response.status})`;
    } else if (error.message) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};