import axios from "axios";

// Base configuration for booking API
export const bookingApi = axios.create({
  baseURL: "/api/v1/bookings",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

// Request interceptor for adding auth token when available
bookingApi.interceptors.request.use(config => {
  const token = store.getState()
    ?.user
      ?.accessToken;
  if (token && !config.url.endsWith("/guest")) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});



/**
 * Create a new authenticated user booking
 * @param {Object} bookingData - Booking details
 * @returns {Promise<Object>} - Created booking data
 */
export const createUserBooking = async bookingData => {
  try {
    const response = await bookingApi.post("/user", bookingData);
    return handleBookingResponse(response, "Booking created successfully");
  } catch (error) {
    return handleBookingError(error, "Failed to create booking");
  }
};

/**
 * Create a new guest booking
 * @param {Object} bookingData - Booking details including guestInfo
 * @returns {Promise<Object>} - Created booking data
 */
export const createGuestBooking = async bookingData => {
  try {
    const response = await bookingApi.post("/guest", bookingData);
    return handleBookingResponse(response, "Guest booking created successfully");
  } catch (error) {
    return handleBookingError(error, "Failed to create guest booking");
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
    return handleBookingResponse(response, "Booking updated successfully");
  } catch (error) {
    return handleBookingError(error, "Failed to update booking", {
      404: "Booking not found",
      403: "You are not authorized to update this booking"
    });
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
    return handleBookingResponse(response, "Booking cancelled successfully");
  } catch (error) {
    return handleBookingError(error, "Failed to cancel booking", {
      404: "Booking not found",
      403: "You are not authorized to cancel this booking"
    });
  }
};

/**
 * Get all bookings for the current authenticated user
 * @returns {Promise<Array>} - Array of user bookings
 */
export const getUserBookings = async () => {
  try {
    const response = await bookingApi.get("/user");
    return handleBookingResponse(response, "User bookings fetched successfully");
  } catch (error) {
    return handleBookingError(error, "Failed to fetch user bookings");
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
    return handleBookingResponse(response, "Guest bookings fetched successfully");
  } catch (error) {
    return handleBookingError(error, "Failed to fetch guest bookings");
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
    return handleBookingResponse(response, "Service bookings fetched successfully");
  } catch (error) {
    return handleBookingError(error, "Failed to fetch service bookings", {
      403: "You don't have permission to view these bookings",
      404: "Service not found"
    });
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
    return handleBookingResponse(response, "Availability checked successfully");
  } catch (error) {
    return handleBookingError(error, "Failed to check room availability");
  }
};

// Helper function to handle successful booking responses
const handleBookingResponse = (response, defaultMessage) => ({
  success: true,
  data: response.data
    ?.data || response.data,
  message: response.data
    ?.message || defaultMessage
});

// Helper function to handle booking errors
const handleBookingError = (error, defaultMessage, statusMessages = {}) => {
  let errorMessage = defaultMessage;

  if (error.response) {
    errorMessage = error.response.data
      ?.message || statusMessages[error.response.status] || error.response.statusText || `Server error (${error.response.status})`;
  } else if (error.request) {
    errorMessage = "No response received from server";
  }

  return {
    success: false,
    error: errorMessage,
    status: error.response
      ?.status
  };
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