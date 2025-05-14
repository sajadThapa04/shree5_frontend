import axios from "axios";

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  maxRequests: 5, // Max requests per window
  windowMs: 60 * 1000 // 1 minute window
};

let requestCount = 0;
let lastRequestTime = Date.now();

export const hostApi = axios.create({
  baseURL: "/api/v1/hosts",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

// Add request interceptor for rate limiting
hostApi.interceptors.request.use(async config => {
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

// Response interceptor to handle token refresh
hostApi.interceptors.response.use(response => response, async error => {
  const originalRequest = error.config;

  if (error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;

    try {
      const {refreshToken} = store.getState().user;
      if (!refreshToken) 
        throw new Error("No refresh token");
      
      const {data} = await hostApi.post("/refresh-token", {refreshToken});
      store.dispatch(setAuthTokens({accessToken: data.data.accessToken, refreshToken: data.data.refreshToken}));

      originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
      return hostApi(originalRequest);
    } catch (err) {
      store.dispatch(logoutUsers());
      return Promise.reject(err);
    }
  }

  return Promise.reject(error);
});
// create host profile api method
export const createHostProfile = async hostData => {
  try {
    // Validate required fields
    if (!hostData.name || !hostData.description || !hostData.phone || !hostData.email || !hostData.coordinates) {
      throw new Error("All required fields must be provided");
    }

    // Validate coordinates
    if (!Array.isArray(hostData.coordinates) || hostData.coordinates.length !== 2) {
      throw new Error("Coordinates must be an array of [longitude, latitude]");
    }

    const response = await hostApi.post("/", hostData);

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
      message: response.data.message || "Host profile created successfully",
      statusCode: response.data.statusCode
    };
  } catch (error) {
    let errorMessage = "Failed to create host profile";

    if (error.response) {
      // Handle backend validation errors
      if (error.response.status === 400) {
        errorMessage = error.response.data
          ?.message || "Validation failed";
      } else if (error.response.status === 401) {
        errorMessage = "Authentication required";
      } else if (error.response.status === 403) {
        errorMessage = "Not authorized to create host profile";
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

// We'll add other host API methods (getHostById, updateHost, etc.) later
//getHostById  hosts api method
export const getHostById = async hostId => {
  try {
    // Validate the host ID
    if (!hostId || typeof hostId !== "string") {
      throw new Error("Valid host ID must be provided");
    }

    const response = await hostApi.get(`/${hostId}`);

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
      message: response.data.message || "Host fetched successfully",
      statusCode: response.data.statusCode
    };
  } catch (error) {
    let errorMessage = "Failed to fetch host profile";

    if (error.response) {
      if (error.response.status === 401) {
        errorMessage = "Authentication required";
      } else if (error.response.status === 404) {
        errorMessage = error.response.data
          ?.message || "Host not found";
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

//getHostByUser hosts api method
export const getHostsByUser = async userId => {
  try {
    // Validate the user ID
    if (!userId || typeof userId !== "string") {
      throw new Error("Valid user ID must be provided");
    }

    const response = await hostApi.get(`/user/${userId}`);

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
      message: response.data.message || "Hosts fetched successfully",
      statusCode: response.data.statusCode
    };
  } catch (error) {
    let errorMessage = "Failed to fetch hosts by user";

    if (error.response) {
      if (error.response.status === 400) {
        errorMessage = error.response.data
          ?.message || "Invalid user ID";
      } else if (error.response.status === 401) {
        errorMessage = "Authentication required";
      } else if (error.response.status === 404) {
        errorMessage = error.response.data
          ?.message || "No hosts found for this user";
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

//updatehostprofile hosts api method
export const updateHostProfile = async (hostId, updateData) => {
  try {
    // Validate the host ID
    if (!hostId || typeof hostId !== "string") {
      throw new Error("Valid host ID must be provided");
    }

    // Validate at least one field is being updated
    if (!updateData || Object.keys(updateData).length === 0) {
      throw new Error("At least one field must be provided for update");
    }

    // Validate coordinates if provided
    if (updateData.coordinates) {
      if (!Array.isArray(updateData.coordinates) || updateData.coordinates.length !== 2) {
        throw new Error("Coordinates must be an array of [longitude, latitude]");
      }
    }

    const response = await hostApi.patch(`/${hostId}`, updateData);

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
      message: response.data.message || "Host profile updated successfully",
      statusCode: response.data.statusCode
    };
  } catch (error) {
    let errorMessage = "Failed to update host profile";

    if (error.response) {
      if (error.response.status === 400) {
        errorMessage = error.response.data
          ?.message || "Validation failed";
      } else if (error.response.status === 401) {
        errorMessage = "Authentication required";
      } else if (error.response.status === 403) {
        errorMessage = "Not authorized to update this host profile";
      } else if (error.response.status === 404) {
        errorMessage = error.response.data
          ?.message || "Host not found";
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

//getall hosts api method
export const getAllHosts = async (queryParams = {}) => {
  try {
    // Validate query parameters
    if (queryParams.page && isNaN(queryParams.page)) {
      throw new Error("Page must be a number");
    }
    if (queryParams.limit && isNaN(queryParams.limit)) {
      throw new Error("Limit must be a number");
    }
    if (queryParams.sortOrder && !["asc", "desc"].includes(queryParams.sortOrder)) {
      throw new Error("Sort order must be either 'asc' or 'desc'");
    }

    const response = await hostApi.get("/", {params: queryParams});

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
      pagination: response.data.pagination,
      message: response.data.message || "Hosts fetched successfully",
      statusCode: response.data.statusCode
    };
  } catch (error) {
    let errorMessage = "Failed to fetch hosts";

    if (error.response) {
      if (error.response.status === 400) {
        errorMessage = error.response.data
          ?.message || "Invalid query parameters";
      } else if (error.response.status === 401) {
        errorMessage = "Authentication required";
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