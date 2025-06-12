// stores/Slices/roomPaymentSlice.js
import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {
  createUserPayment,
  createGuestPayment,
  confirmUserPayment,
  confirmGuestPayment,
  updatePaymentStatus,
  getPaymentById,
  getUserPayments,
  processRefund
} from "../../services/roomPayment.api";

const initialState = {
  payments: [],
  currentPayment: null,
  loading: false,
  error: null,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  refundStatus: "idle"
};

// Async thunks
export const makeUserPayment = createAsyncThunk("payment/createUserPayment", async (paymentData, {rejectWithValue}) => {
  try {
    const response = await createUserPayment(paymentData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const makeGuestPayment = createAsyncThunk("payment/createGuestPayment", async (paymentData, {rejectWithValue}) => {
  try {
    const response = await createGuestPayment(paymentData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const verifyUserPayment = createAsyncThunk("payment/confirmUserPayment", async (confirmationData, {rejectWithValue}) => {
  try {
    const response = await confirmUserPayment(confirmationData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const verifyGuestPayment = createAsyncThunk("payment/confirmGuestPayment", async (confirmationData, {rejectWithValue}) => {
  try {
    const response = await confirmGuestPayment(confirmationData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const updatePayment = createAsyncThunk("payment/updateStatus", async ({
  paymentId,
  status
}, {rejectWithValue}) => {
  try {
    const response = await updatePaymentStatus(paymentId, status);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const fetchPaymentById = createAsyncThunk("payment/getById", async (paymentId, {rejectWithValue}) => {
  try {
    const response = await getPaymentById(paymentId);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const fetchUserPayments = createAsyncThunk("payment/getUserPayments", async (options, {rejectWithValue}) => {
  try {
    const response = await getUserPayments(options);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const refundPayment = createAsyncThunk("payment/processRefund", async ({
  paymentId,
  refundAmount
}, {rejectWithValue}) => {
  try {
    const response = await processRefund(paymentId, refundAmount);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const roomPaymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setCurrentPayment: (state, action) => {
      state.currentPayment = action.payload;
    },
    clearPaymentError: state => {
      state.error = null;
    },
    resetPaymentState: () => initialState,
    setPaymentStatus: (state, action) => {
      state.status = action.payload;
    },
    clearPayment: state => {
      state.currentPayment = null;
      state.error = null;
      state.status = "idle";
    }
  },
  extraReducers: builder => {
    builder
    // Create User Payment
      .addCase(makeUserPayment.pending, state => {
      state.loading = true;
      state.error = null;
      state.status = "processing";
    }).addCase(makeUserPayment.fulfilled, (state, action) => {
      state.loading = false;
      state.currentPayment = action.payload;
      state.payments.push(action.payload);
      state.status = "succeeded";
    }).addCase(makeUserPayment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status = "failed";
    })

    // Create Guest Payment
      .addCase(makeGuestPayment.pending, state => {
      state.loading = true;
      state.error = null;
      state.status = "processing";
    }).addCase(makeGuestPayment.fulfilled, (state, action) => {
      state.loading = false;
      state.currentPayment = action.payload;
      state.payments.push(action.payload);
      state.status = "succeeded";
    }).addCase(makeGuestPayment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status = "failed";
    })

    // Confirm User Payment
      .addCase(verifyUserPayment.pending, state => {
      state.loading = true;
      state.error = null;
      state.status = "confirming";
    }).addCase(verifyUserPayment.fulfilled, (state, action) => {
      state.loading = false;
      if (
        state.currentPayment
        ?._id === action.payload._id) {
        state.currentPayment = action.payload;
      }
      state.payments = state.payments.map(
        payment => payment._id === action.payload._id
        ? action.payload
        : payment);
      state.status = "succeeded";
    }).addCase(verifyUserPayment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status = "failed";
    })

    // Confirm Guest Payment
      .addCase(verifyGuestPayment.pending, state => {
      state.loading = true;
      state.error = null;
      state.status = "confirming";
    }).addCase(verifyGuestPayment.fulfilled, (state, action) => {
      state.loading = false;
      if (
        state.currentPayment
        ?._id === action.payload._id) {
        state.currentPayment = action.payload;
      }
      state.payments = state.payments.map(
        payment => payment._id === action.payload._id
        ? action.payload
        : payment);
      state.status = "succeeded";
    }).addCase(verifyGuestPayment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status = "failed";
    })

    // Update Payment Status
      .addCase(updatePayment.pending, state => {
      state.loading = true;
      state.error = null;
      state.status = "updating";
    }).addCase(updatePayment.fulfilled, (state, action) => {
      state.loading = false;
      if (
        state.currentPayment
        ?._id === action.payload._id) {
        state.currentPayment = action.payload;
      }
      state.payments = state.payments.map(
        payment => payment._id === action.payload._id
        ? action.payload
        : payment);
      state.status = "succeeded";
    }).addCase(updatePayment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status = "failed";
    })

    // Fetch Payment by ID
      .addCase(fetchPaymentById.pending, state => {
      state.loading = true;
      state.error = null;
      state.status = "loading";
    }).addCase(fetchPaymentById.fulfilled, (state, action) => {
      state.loading = false;
      state.currentPayment = action.payload;
      state.status = "succeeded";
    }).addCase(fetchPaymentById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status = "failed";
    })

    // Fetch User Payments
      .addCase(fetchUserPayments.pending, state => {
      state.loading = true;
      state.error = null;
      state.status = "loading";
    }).addCase(fetchUserPayments.fulfilled, (state, action) => {
      state.loading = false;
      state.payments = action.payload;
      state.status = "succeeded";
    }).addCase(fetchUserPayments.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status = "failed";
    })

    // Process Refund
      .addCase(refundPayment.pending, state => {
      state.loading = true;
      state.error = null;
      state.refundStatus = "processing";
    }).addCase(refundPayment.fulfilled, (state, action) => {
      state.loading = false;
      if (
        state.currentPayment
        ?._id === action.payload._id) {
        state.currentPayment = action.payload;
      }
      state.payments = state.payments.map(
        payment => payment._id === action.payload._id
        ? action.payload
        : payment);
      state.refundStatus = "succeeded";
    }).addCase(refundPayment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.refundStatus = "failed";
    });
  }
});

export const {setCurrentPayment, clearPaymentError, resetPaymentState, setPaymentStatus, clearPayment} = roomPaymentSlice.actions;

// Selectors
export const selectPayments = state => state.roomPayments.payments;
export const selectCurrentPayment = state => state.roomPayments.currentPayment;
export const selectPaymentLoading = state => state.roomPayments.loading;
export const selectPaymentError = state => state.roomPayments.error;
export const selectPaymentStatus = state => state.roomPayments.status;
export const selectRefundStatus = state => state.roomPayments.refundStatus;

export default roomPaymentSlice.reducer;