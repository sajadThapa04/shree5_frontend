import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {getServicesForHost, getServiceNames} from "../../services/services.api";

const initialState = {
  data: {
    services: [],
    count: 0
  },
  allServiceNames: [], // New state for storing all service names
  activeService: null,
  loading: false,
  error: null,
  status: "idle",
  namesLoading: false, // Separate loading state for service names
  namesError: null // Separate error state for service names
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

// New async thunk for fetching all service names
export const fetchAllServiceNames = createAsyncThunk("services/fetchAllNames", async (_, {rejectWithValue}) => {
  try {
    const response = await getServiceNames();
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
    builder
    // Existing cases for fetchServicesForHost
      .addCase(fetchServicesForHost.pending, state => {
      state.loading = true;
      state.error = null;
    }).addCase(fetchServicesForHost.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      if (
        action.payload.services
        ?.length > 0 && !state.activeService) {
        state.activeService = action.payload.services[0];
      }
    }).addCase(fetchServicesForHost.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    // New cases for fetchAllServiceNames
      .addCase(fetchAllServiceNames.pending, state => {
      state.namesLoading = true;
      state.namesError = null;
    }).addCase(fetchAllServiceNames.fulfilled, (state, action) => {
      state.namesLoading = false;
      state.allServiceNames = action.payload;
    }).addCase(fetchAllServiceNames.rejected, (state, action) => {
      state.namesLoading = false;
      state.namesError = action.payload;
    });
  }
});

export const {setActiveService, clearServices} = serviceSlice.actions;

// Selectors
export const selectServices = state => state.services.data.services;
export const selectActiveService = state => state.services.activeService;
export const selectServicesLoading = state => state.services.loading;
export const selectServicesError = state => state.services.error;

// New selectors for service names
export const selectAllServiceNames = state => state.services.allServiceNames;
export const selectServiceNamesLoading = state => state.services.namesLoading;
export const selectServiceNamesError = state => state.services.namesError;

export default serviceSlice.reducer;