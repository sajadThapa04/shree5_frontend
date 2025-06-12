import axios from "axios";

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  maxRequests: 5,
  windowMs: 60 * 1000
};

let requestCount = 0;
let lastRequestTime = Date.now();

export const paymentApi = axios.create({
  baseURL: "/api/v1/payments",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

// Request interceptor for rate limiting
paymentApi.interceptors.request.use(async config => {
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
 * Create a new payment (authenticated user)
 * @param {Object} paymentData - Payment data
 * @returns {Object} Response object with success status, data, and message
 */
export const createUserPayment = async paymentData => {
  try {
    if (!paymentData.booking || !paymentData.paymentMethod || !paymentData.amount) {
      throw new Error("Booking, payment method, and amount are required fields");
    }

    if (paymentData.amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    const response = await paymentApi.post("/user", paymentData);

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
      message: response.data.message || "Payment created successfully",
      statusCode: response.status
    };
  } catch (error) {
    let errorMessage = "Failed to create payment";

    if (error.response) {
      if (error.response.status === 400) {
        errorMessage = error.response.data
          ?.message || "Validation failed";
      } else if (error.response.status === 401) {
        errorMessage = "Authentication required";
      } else if (error.response.status === 403) {
        errorMessage = "Not authorized";
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
 * Create a new guest payment
 * @param {Object} paymentData - Payment data including guest info
 * @returns {Object} Response object with success status, data, and message
 */

export const createGuestPayment = async paymentData => {
  try {
    console.log("Received booking data:", JSON.stringify(paymentData, null, 2));
    const payload = {
      booking: paymentData.booking,
      paymentMethod: paymentData.paymentMethod,
      amount: paymentData.amount,
      paymentMetadata: paymentData.paymentMetadata || {},
      guestInfo: {
        // Nest the email under guestInfo
        email: paymentData.email
      }
    };

    console.log("Sending payment data:", JSON.stringify(payload, null, 2));

    const response = await paymentApi.post("/guest", payload);

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
      message: response.data.message || "Guest payment created successfully",
      statusCode: response.status
    };
  } catch (error) {
    let errorMessage = "Failed to create guest payment";

    if (error.response) {
      if (error.response.status === 400) {
        errorMessage = error.response.data
          ?.message || "Validation failed";
      } else if (error.response.status === 403) {
        errorMessage = "Guest payment not allowed";
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
 * Confirm a user payment (authenticated)
 * @param {Object} confirmationData - { paymentIntentId, paymentMethodId }
 * @returns {Object} Response object with success status, data, and message
 */
export const confirmUserPayment = async confirmationData => {
  try {
    if (!confirmationData.paymentIntentId || !confirmationData.paymentMethodId) {
      throw new Error("Payment intent ID and payment method ID are required");
    }

    const response = await paymentApi.post("/users/confirm", confirmationData);

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
      message: response.data.message || "Payment confirmed successfully",
      statusCode: response.status
    };
  } catch (error) {
    let errorMessage = "Failed to confirm payment";

    if (error.response) {
      if (error.response.status === 400) {
        errorMessage = error.response.data
          ?.message || "Validation failed";
      } else if (error.response.status === 401) {
        errorMessage = "Authentication required";
      } else if (error.response.status === 403) {
        errorMessage = "Not authorized to confirm this payment";
      } else if (error.response.status === 404) {
        errorMessage = "Payment not found";
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
 * Confirm a guest payment
 * @param {Object} confirmationData - { paymentIntentId, paymentMethodId, email }
 * @returns {Object} Response object with success status, data, and message
 */
export const confirmGuestPayment = async confirmationData => {
  try {
    if (!confirmationData.paymentIntentId || !confirmationData.paymentMethodId || !confirmationData.email) {
      throw new Error("Payment intent ID, payment method ID, and email are required");
    }

    const response = await paymentApi.post("/guest/confirm", confirmationData);

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
      message: response.data.message || "Guest payment confirmed successfully",
      statusCode: response.status
    };
  } catch (error) {
    let errorMessage = "Failed to confirm guest payment";

    if (error.response) {
      if (error.response.status === 400) {
        errorMessage = error.response.data
          ?.message || "Validation failed";
      } else if (error.response.status === 404) {
        errorMessage = "Payment not found";
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
 * Update payment status
 * @param {String} paymentId - Payment ID
 * @param {String} status - New status
 * @returns {Object} Response object with success status, data, and message
 */
export const updatePaymentStatus = async (paymentId, status) => {
  try {
    if (!paymentId || !status) {
      throw new Error("Payment ID and status are required");
    }

    const response = await paymentApi.put(`/${paymentId}/status`, {status});

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
      message: response.data.message || "Payment status updated successfully",
      statusCode: response.status
    };
  } catch (error) {
    let errorMessage = "Failed to update payment status";

    if (error.response) {
      if (error.response.status === 400) {
        errorMessage = error.response.data
          ?.message || "Validation failed";
      } else if (error.response.status === 401) {
        errorMessage = "Authentication required";
      } else if (error.response.status === 403) {
        errorMessage = "Not authorized to update this payment";
      } else if (error.response.status === 404) {
        errorMessage = "Payment not found";
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
 * Get payment by ID
 * @param {String} paymentId - Payment ID
 * @returns {Object} Response object with success status, data, and message
 */
export const getPaymentById = async paymentId => {
  try {
    if (!paymentId) {
      throw new Error("Payment ID is required");
    }

    const response = await paymentApi.get(`/user/${paymentId}`);

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
      message: response.data.message || "Payment details fetched successfully",
      statusCode: response.status
    };
  } catch (error) {
    let errorMessage = "Failed to get payment";

    if (error.response) {
      if (error.response.status === 401) {
        errorMessage = "Authentication required";
      } else if (error.response.status === 403) {
        errorMessage = "Not authorized to view this payment";
      } else if (error.response.status === 404) {
        errorMessage = "Payment not found";
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
 * Get all payments for current user
 * @param {Object} options - { page, limit, status }
 * @returns {Object} Response object with success status, data, and message
 */
export const getUserPayments = async (options = {}) => {
  try {
    const {
      page = 1,
      limit = 10,
      status
    } = options;
    const params = {
      page,
      limit
    };

    if (status) {
      params.status = status;
    }

    const response = await paymentApi.get("/user", {params});

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
      message: response.data.message || "User payments fetched successfully",
      statusCode: response.status
    };
  } catch (error) {
    let errorMessage = "Failed to get user payments";

    if (error.response) {
      if (error.response.status === 401) {
        errorMessage = "Authentication required";
      } else if (error.response.status === 403) {
        errorMessage = "Not authorized to view payments";
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
 * Process a refund
 * @param {String} paymentId - Payment ID
 * @param {Number} refundAmount - Amount to refund
 * @returns {Object} Response object with success status, data, and message
 */
export const processRefund = async (paymentId, refundAmount) => {
  try {
    if (!paymentId || !refundAmount) {
      throw new Error("Payment ID and refund amount are required");
    }

    if (refundAmount <= 0) {
      throw new Error("Refund amount must be greater than 0");
    }

    const response = await paymentApi.post(`/${paymentId}/refund`, {refundAmount});

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
      message: response.data.message || "Refund processed successfully",
      statusCode: response.status
    };
  } catch (error) {
    let errorMessage = "Failed to process refund";

    if (error.response) {
      if (error.response.status === 400) {
        errorMessage = error.response.data
          ?.message || "Validation failed";
      } else if (error.response.status === 401) {
        errorMessage = "Authentication required";
      } else if (error.response.status === 403) {
        errorMessage = "Not authorized to process this refund";
      } else if (error.response.status === 404) {
        errorMessage = "Payment not found";
      } else if (error.response.status === 409) {
        errorMessage = "Payment is not eligible for refund";
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