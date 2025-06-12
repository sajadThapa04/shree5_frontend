// stores/Slices/bookingSlice.js
import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {getUserBookings, getGuestBookings, getServiceBookings, checkRoomAvailability} from "../../services/roomBooking.api";

const initialState = {
  bookings: [],
  guestBookings: [],
  serviceBookings: [],
  currentBooking: null,
  loading: false,
  error: null,
  status: "idle",
  availability: null
};

// Async thunks
export const fetchUserBookings = createAsyncThunk("bookings/getUserBookings", async (_, {rejectWithValue}) => {
  try {
    const response = await getUserBookings();
    if (!response.success) {
      return rejectWithValue(response.error);
    }
    return {type: "user", data: response.data};
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const fetchGuestBookings = createAsyncThunk("bookings/getGuestBookings", async (email, {rejectWithValue}) => {
  try {
    const response = await getGuestBookings(email);
    if (!response.success) {
      return rejectWithValue(response.error);
    }
    return {type: "guest", data: response.data};
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const fetchServiceBookings = createAsyncThunk("bookings/getServiceBookings", async (serviceId, {rejectWithValue}) => {
  try {
    const response = await getServiceBookings(serviceId);
    if (!response.success) {
      return rejectWithValue(response.error);
    }
    return {type: "service", data: response.data};
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const checkAvailability = createAsyncThunk("bookings/checkAvailability", async ({
  roomId,
  checkInDate,
  checkOutDate
}, {rejectWithValue}) => {
  try {
    const response = await checkRoomAvailability(roomId, checkInDate, checkOutDate);
    if (!response.success) {
      return rejectWithValue(response.error);
    }
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const bookingSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    setCurrentBooking: (state, action) => {
      state.currentBooking = action.payload;
    },
    clearBookingError: state => {
      state.error = null;
    },
    resetBookingState: () => initialState
  },
  extraReducers: builder => {
    builder
    // Fetch user bookings
      .addCase(fetchUserBookings.pending, state => {
      state.loading = true;
      state.error = null;
      state.status = "loading";
    }).addCase(fetchUserBookings.fulfilled, (state, action) => {
      state.loading = false;
      state.bookings = action.payload.data;
      state.status = "succeeded";
    }).addCase(fetchUserBookings.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status = "failed";
    })

    // Fetch guest bookings
      .addCase(fetchGuestBookings.pending, state => {
      state.loading = true;
      state.error = null;
      state.status = "loading";
    }).addCase(fetchGuestBookings.fulfilled, (state, action) => {
      state.loading = false;
      state.guestBookings = action.payload.data;
      state.status = "succeeded";
    }).addCase(fetchGuestBookings.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status = "failed";
    })

    // Fetch service bookings
      .addCase(fetchServiceBookings.pending, state => {
      state.loading = true;
      state.error = null;
      state.status = "loading";
    }).addCase(fetchServiceBookings.fulfilled, (state, action) => {
      state.loading = false;
      state.serviceBookings = action.payload.data;
      state.status = "succeeded";
    }).addCase(fetchServiceBookings.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status = "failed";
    })

    // Check availability
      .addCase(checkAvailability.pending, state => {
      state.loading = true;
      state.error = null;
      state.status = "loading";
    }).addCase(checkAvailability.fulfilled, (state, action) => {
      state.loading = false;
      state.availability = action.payload;
      state.status = "succeeded";
    }).addCase(checkAvailability.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status = "failed";
    });
  }
});

export const {setCurrentBooking, clearBookingError, resetBookingState} = bookingSlice.actions;

// Selectors
export const selectUserBookings = state => state.bookings.bookings;
export const selectGuestBookings = state => state.bookings.guestBookings;
export const selectServiceBookings = state => state.bookings.serviceBookings;
export const selectCurrentBooking = state => state.bookings.currentBooking;
export const selectBookingLoading = state => state.bookings.loading;
export const selectBookingError = state => state.bookings.error;
export const selectBookingStatus = state => state.bookings.status;
export const selectAvailability = state => state.bookings.availability;

export default bookingSlice.reducer;