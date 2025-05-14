import axios from "axios";

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  maxRequests: 5, // Max requests per window
  windowMs: 60 * 1000 // 1 minute window
};

// const requestQueue = [];
let requestCount = 0;
let lastRequestTime = Date.now();


//well we can set this api const value in the globally so we can access it rather than 
// /api/v1/users would be better to use /api/v1 so we can use it on other routes as well.
export const api = axios.create({
  baseURL: "/api/v1/users",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

// Add request interceptor for rate limiting
api.interceptors.request.use(async config => {
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

// axios instance to automatically refresh tokens:
api.interceptors.response.use(response => response, async error => {
  const originalRequest = error.config;

  if (error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;

    try {
      const {refreshToken} = store.getState().user;
      if (!refreshToken) 
        throw new Error("No refresh token");
      
      const {data} = await api.post("/refresh-token", {refreshToken});
      store.dispatch(setAuthTokens({accessToken: data.data.accessToken, refreshToken: data.data.refreshToken}));

      originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
      return api(originalRequest);
    } catch (err) {
      store.dispatch(logoutUsers());
      return Promise.reject(err);
    }
  }

  return Promise.reject(error);
});

//register users routes
export const registerUser = async userData => {
  try {
    const response = await api.post("/register", userData);

    if (!response.data) {
      throw new Error("No response data received");
    }

    // Match the backend ApiResponse structure
    return {
      success: response.data.success,
      data: response.data.data,
      message: response.data.message || "Registration successful",
      statusCode: response.data.statusCode
    };
  } catch (error) {
    let errorMessage = "Registration failed";

    if (error.response) {
      // Handle your backend's ApiError format
      errorMessage = error.response.data
        ?.message || error.response.statusText || `Server error (${error.response.status})`;
    } else if (error.request) {
      errorMessage = "No response from server";
    } else {
      errorMessage = error.message || "Registration failed";
    }

    throw new Error(errorMessage);
  }
};

//login users routes
export const loginUser = async userData => {
  try {
    const response = await api.post("/login", userData);

    // Check if response has the expected structure
    if (
      !response
      ?.data
        ?.success || !response
          ?.data
            ?.data
              ?.user || !response
                ?.data
                  ?.data
                    ?.accessToken) {
      throw new Error("Invalid login response structure");
    }

    // Return normalized data structure
    return {user: response.data.data.user, accessToken: response.data.data.accessToken, refreshToken: response.data.data.refreshToken};
  } catch (error) {
    // Enhanced error handling
    let errorMessage = "Login failed please contact us at shree5@gmail.com";

    if (error.response) {
      // Server responded with error status
      errorMessage = error.response.data
        ?.message || error.response.statusText || `Server error (${error.response.status})`;
    } else if (error.request) {
      // Request was made but no response received
      errorMessage = "No response from server";
    }

    throw new Error(errorMessage);
  }
};

//logout user routes
export const logOutUser = async () => {
  try {
    const response = await api.post("/logout");

    // Check if response has the expected structure
    if (
      !response
      ?.data
        ?.success) {
      throw new Error("Invalid logout response structure");
    }

    // Return normalized data structure
    return {
      success: response.data.success,
      message: response.data.message || "Logout successful",
      statusCode: response.data.statusCode
    };
  } catch (error) {
    // Enhanced error handling
    let errorMessage = "Logout failed";

    if (error.response) {
      // Server responded with error status
      errorMessage = error.response.data
        ?.message || error.response.statusText || `Server error (${error.response.status})`;
    } else if (error.request) {
      // Request was made but no response received
      errorMessage = "No response from server";
    }

    throw new Error(errorMessage);
  }
};

//verify email routes
export const verifyEmail = async token => {
  try {
    const response = await api.get("/verify-email", {params: {
        token
      }});

    // Check if response has the expected structure
    if (
      !response
      ?.data
        ?.success) {
      throw new Error("Invalid verification response structure");
    }

    // Return normalized data structure
    return {
      success: response.data.success,
      message: response.data.message || "Email verified successfully",
      statusCode: response.data.statusCode
    };
  } catch (error) {
    // Enhanced error handling
    let errorMessage = "Email verification failed";

    if (error.response) {
      // Server responded with error status
      errorMessage = error.response.data
        ?.message || error.response.statusText || `Server error (${error.response.status})`;

      // Handle specific JWT errors that might come from backend
      if (
        error.response.status === 400 && error.response.data
        ?.message
          ?.includes("token")) {
        errorMessage = "Invalid or expired verification link";
      }
    } else if (error.request) {
      // Request was made but no response received
      errorMessage = "No response from server";
    } else if (error.message.includes("structure")) {
      // Keep the specific structure error message
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

// resend verfication email
export const resendVerificationEmail = async email => {
  try {
    const response = await api.post("/resend-verification", {email});

    if (
      !response
      ?.data
        ?.success) {
      throw new Error(
        response
        ?.data
          ?.message || "Invalid verification resend response");
    }

    return {
      success: response.data.success,
      message: response.data.message || "Verification email resent successfully",
      statusCode: response.data.statusCode
    };
  } catch (error) {
    let errorMessage = "Failed to resend verification email";

    if (error.response) {
      errorMessage = error.response.data
        ?.message || error.response.statusText || `Server error (${error.response.status})`;

      // Handle rate limiting specifically
      if (error.response.status === 429) {
        errorMessage = "Too many requests. Please try again later.";
      }
    }

    throw new Error(errorMessage);
  }
};

//refresh access token routes
export const refreshAccessToken = async refreshToken => {
  try {
    const response = await api.post("/refresh-token", {refreshToken});

    // Check if response has the expected structure
    if (
      !response
      ?.data
        ?.success || !response
          ?.data
            ?.data
              ?.accessToken || !response
                ?.data
                  ?.data
                    ?.refreshToken) {
      throw new Error("Invalid refresh token response structure");
    }

    // Return normalized data structure
    return {
      success: response.data.success,
      data: {
        accessToken: response.data.data.accessToken,
        refreshToken: response.data.data.refreshToken
      },
      message: response.data.message || "Access token refreshed successfully",
      statusCode: response.data.statusCode
    };
  } catch (error) {
    // Enhanced error handling
    let errorMessage = "Failed to refresh access token";

    if (error.response) {
      // Server responded with error status
      errorMessage = error.response.data
        ?.message || error.response.statusText || `Server error (${error.response.status})`;

      // Handle specific token errors
      if (error.response.status === 401) {
        if (
          error.response.data
          ?.message
            ?.includes("Unauthorized")) {
          errorMessage = "Please log in again";
        } else if (
          error.response.data
          ?.message
            ?.includes("expired") || error.response.data
              ?.message
                ?.includes("used")) {
          errorMessage = "Session expired. Please log in again";
        }
      }
    } else if (error.request) {
      // Request was made but no response received
      errorMessage = "No response from server";
    } else if (error.message.includes("structure")) {
      // Keep the specific structure error message
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

export const fetchUserProfile = async () => {
  try {
    const response = await api.get("/get-user"); // or your actual endpoint

    if (!response.data) {
      throw new Error("No response data received");
    }
    console.log(response.data);

    return {
      success: response.data.success, data: response.data.data, // This should contain the full user object
      message: response.data.message || "User profile fetched successfully",
      statusCode: response.data.statusCode
    };
  } catch (error) {
    let errorMessage = "Failed to fetch user profile";

    if (error.response) {
      errorMessage = error.response.data
        ?.message || error.response.statusText || `Server error (${error.response.status})`;
    } else if (error.request) {
      errorMessage = "No response from server";
    } else {
      errorMessage = error.message || "Failed to fetch user profile";
    }

    throw new Error(errorMessage);
  }
};

//in this api endpoint we are naming our method upload profile pic
//  but we are using the update profile pic routes and we will customise it later on
export const uploadProfileImage = async file => {
  try {
    // Create FormData object to send the file
    const formData = new FormData();
    formData.append("profileImage", file);

    // Make PATCH request with the FormData
    const response = await api.patch("/update-profile-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    if (
      !response.data
      ?.success) {
      throw new Error(
        response.data
        ?.message || "Failed to upload profile image");
    }

    return {
      success: true,
      data: response.data.data,
      message: response.data.message || "Profile image uploaded successfully"
    };
  } catch (error) {
    let errorMessage = "Failed to upload profile image";

    if (error.response) {
      errorMessage = error.response.data
        ?.message || error.response.statusText || `Server error (${error.response.status})`;
    } else if (error.message) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

export const updateUserAddress = async addressData => {
  try {
    const {country, city, street} = addressData;

    // Validate at least one address field is provided
    if (!country && !city && !street) {
      throw new Error("At least one address field (country, city, or street) is required");
    }

    const response = await api.patch("/update-user-address", {country, city, street});

    if (
      !response.data
      ?.success) {
      throw new Error(
        response.data
        ?.message || "Failed to update address");
    }

    return {
      success: true,
      data: response.data.data,
      message: response.data.message || "Address updated successfully"
    };
  } catch (error) {
    let errorMessage = "Failed to update address";

    if (error.response) {
      errorMessage = error.response.data
        ?.message || error.response.statusText || `Server error (${error.response.status})`;
    } else if (error.message) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};
