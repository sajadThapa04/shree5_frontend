import axios from "axios";

// Base configuration for booking API
export const bookingApi = axios.create({
  baseURL: "/api/v1/bookings",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

/**
 * Create a new authenticated user booking
 * @param {Object} bookingData - Booking details
 * @returns {Promise<Object>} - Created booking data
 */
export const createUserBooking = async bookingData => {
  try {
    const response = await bookingApi.post("/user", bookingData);

    if (response.data && response.data.success === false) {
      return {
        success: false,
        error: response.data.message || "Failed to create booking",
        data: null
      };
    }

    return {success: true, data: response.data, message: "Booking created successfully"};
  } catch (error) {
    let errorMessage = "Failed to create booking";

    if (error.response) {
      errorMessage = error.response.data
        ?.message || error.response.statusText;

      return {success: false, error: errorMessage, statusCode: error.response.status, data: null};
    } else if (error.request) {
      errorMessage = "No response received from server";
    }

    return {success: false, error: errorMessage, data: null};
  }
};

/**
 * Create a new guest booking
 * @param {Object} bookingData - Booking details including guestInfo
 * @returns {Promise<Object>} - Created booking data
 */

export const createGuestBooking = async bookingData => {
  try {
    console.log("Received booking data:", JSON.stringify(bookingData, null, 2));

    const response = await bookingApi.post("/guest", bookingData);

    if (
      !response.data
      ?.success) {
      return {
        success: false,
        error: response.data
          ?.message || "Failed to create booking",
        data: null
      };
    }

    return {success: true, data: response.data.data, message: "Booking created successfully"};
  } catch (error) {
    let errorMessage = "Failed to create booking";

    if (error.response) {
      errorMessage = error.response.data
        ?.message || error.response.statusText;

      return {success: false, error: errorMessage, statusCode: error.response.status, data: null};
    }

    return {success: false, error: errorMessage, data: null};
  }
};
/**
 * Update an existing booking
 * @param {string} bookingId - ID of the booking to update
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} - Updated booking data
 */
export const updateBooking = async (bookingId, updateData) => {
  try {
    const response = await bookingApi.patch(`/${bookingId}`, updateData);

    if (response.data && response.data.success === false) {
      return {
        success: false,
        error: response.data.message || "Failed to update booking",
        data: null
      };
    }

    return {success: true, data: response.data, message: "Booking updated successfully"};
  } catch (error) {
    let errorMessage = "Failed to update booking";

    if (error.response) {
      if (error.response.status === 404) {
        errorMessage = "Booking not found";
      } else if (error.response.status === 403) {
        errorMessage = "You are not authorized to update this booking";
      } else {
        errorMessage = error.response.data
          ?.message || error.response.statusText;
      }

      return {success: false, error: errorMessage, statusCode: error.response.status, data: null};
    } else if (error.request) {
      errorMessage = "No response received from server";
    }

    return {success: false, error: errorMessage, data: null};
  }
};

/**
 * Cancel a booking
 * @param {string} bookingId - ID of the booking to cancel
 * @returns {Promise<Object>} - Cancellation confirmation
 */
export const cancelBooking = async bookingId => {
  try {
    const response = await bookingApi.delete(`/${bookingId}`);

    if (response.data && response.data.success === false) {
      return {
        success: false,
        error: response.data.message || "Failed to cancel booking",
        data: null
      };
    }

    return {success: true, data: response.data, message: "Booking cancelled successfully"};
  } catch (error) {
    let errorMessage = "Failed to cancel booking";

    if (error.response) {
      if (error.response.status === 404) {
        errorMessage = "Booking not found";
      } else if (error.response.status === 403) {
        errorMessage = "You are not authorized to cancel this booking";
      } else {
        errorMessage = error.response.data
          ?.message || error.response.statusText;
      }

      return {success: false, error: errorMessage, statusCode: error.response.status, data: null};
    } else if (error.request) {
      errorMessage = "No response received from server";
    }

    return {success: false, error: errorMessage, data: null};
  }
};

/**
 * Get all bookings for the current authenticated user
 * @returns {Promise<Array>} - Array of user bookings
 */
export const getUserBookings = async () => {
  try {
    const response = await bookingApi.get("/user");

    if (response.data && response.data.success === false) {
      return {
        success: false,
        error: response.data.message || "Failed to fetch user bookings",
        data: null
      };
    }

    return {success: true, data: response.data, message: "User bookings fetched successfully"};
  } catch (error) {
    let errorMessage = "Failed to fetch user bookings";

    if (error.response) {
      errorMessage = error.response.data
        ?.message || error.response.statusText;

      return {success: false, error: errorMessage, statusCode: error.response.status, data: null};
    } else if (error.request) {
      errorMessage = "No response received from server";
    }

    return {success: false, error: errorMessage, data: null};
  }
};

/**
 * Get bookings for a guest user by email
 * @param {string} email - Guest's email address
 * @returns {Promise<Array>} - Array of guest bookings
 */
export const getGuestBookings = async email => {
  try {
    const response = await bookingApi.get("/user", {params: {
        email
      }});

    if (response.data && response.data.success === false) {
      return {
        success: false,
        error: response.data.message || "Failed to fetch guest bookings",
        data: null
      };
    }

    return {success: true, data: response.data, message: "Guest bookings fetched successfully"};
  } catch (error) {
    let errorMessage = "Failed to fetch guest bookings";

    if (error.response) {
      errorMessage = error.response.data
        ?.message || error.response.statusText;

      return {success: false, error: errorMessage, statusCode: error.response.status, data: null};
    } else if (error.request) {
      errorMessage = "No response received from server";
    }

    return {success: false, error: errorMessage, data: null};
  }
};

/**
 * Get all bookings for a specific service (host view)
 * @param {string} serviceId - ID of the service
 * @returns {Promise<Array>} - Array of service bookings
 */
export const getServiceBookings = async serviceId => {
  try {
    const response = await bookingApi.get(`/service/${serviceId}`);

    if (response.data && response.data.success === false) {
      return {
        success: false,
        error: response.data.message || "Failed to fetch service bookings",
        data: null
      };
    }

    return {success: true, data: response.data, message: "Service bookings fetched successfully"};
  } catch (error) {
    let errorMessage = "Failed to fetch service bookings";

    if (error.response) {
      if (error.response.status === 403) {
        errorMessage = "You don't have permission to view these bookings";
      } else if (error.response.status === 404) {
        errorMessage = "Service not found";
      } else {
        errorMessage = error.response.data
          ?.message || error.response.statusText;
      }

      return {success: false, error: errorMessage, statusCode: error.response.status, data: null};
    } else if (error.request) {
      errorMessage = "No response received from server";
    }

    return {success: false, error: errorMessage, data: null};
  }
};

/**
 * Check room availability
 * @param {string} roomId - ID of the room
 * @param {Date} checkInDate - Check-in date
 * @param {Date} checkOutDate - Check-out date
 * @returns {Promise<Object>} - Availability status
 */
export const checkRoomAvailability = async (roomId, checkInDate, checkOutDate) => {
  try {
    const response = await bookingApi.get("/availability", {
      params: {
        roomId,
        checkInDate: checkInDate.toISOString(),
        checkOutDate: checkOutDate.toISOString()
      }
    });

    if (response.data && response.data.success === false) {
      return {
        success: false,
        error: response.data.message || "Failed to check room availability",
        data: null
      };
    }

    return {success: true, data: response.data, message: "Availability checked successfully"};
  } catch (error) {
    let errorMessage = "Failed to check room availability";

    if (error.response) {
      errorMessage = error.response.data
        ?.message || error.response.statusText;

      return {success: false, error: errorMessage, statusCode: error.response.status, data: null};
    } else if (error.request) {
      errorMessage = "No response received from server";
    }

    return {success: false, error: errorMessage, data: null};
  }
};

// Export all functions
export default {
  createUserBooking,
  createGuestBooking,
  updateBooking,
  cancelBooking,
  getUserBookings,
  getGuestBookings,
  getServiceBookings,
  checkRoomAvailability
};