import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {getServicesForHost} from "../../services/services.api";

const initialState = {
  data: {
    services: [],
    count: 0
  },
  activeService: null,
  loading: false,
  error: null,
  status: "idle"
};

export const fetchServicesForHost = createAsyncThunk("services/fetchForHost", async (hostId, {rejectWithValue}) => {
  try {
    const response = await getServicesForHost(hostId);
    return response.data;
  } catch (error) {
    return rejectWithValue(
      error.response
      ?.data || error.message);
  }
});

const serviceSlice = createSlice({
  name: "services",
  initialState,
  reducers: {
    setActiveService: (state, action) => {
      state.activeService = action.payload;
    },
    clearServices: state => {
      state.data.services = [];
      state.data.count = 0;
      state.activeService = null;
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchServicesForHost.pending, state => {
      state.loading = true;
      state.error = null;
    }).addCase(fetchServicesForHost.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      // Automatically set first service as active if none is set
      if (
        action.payload.services
        ?.length > 0 && !state.activeService) {
        state.activeService = action.payload.services[0];
      }
    }).addCase(fetchServicesForHost.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
});

export const {setActiveService, clearServices} = serviceSlice.actions;
export const selectServices = state => state.services.data.services;
export const selectActiveService = state => state.services.activeService;
export const selectServicesLoading = state => state.services.loading;
export const selectServicesError = state => state.services.error;

export default serviceSlice.reducer;