import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {getHostById, getHostsByUser} from "../../services/host.api";

// Helper function to safely parse localStorage items
const safeParse = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item
      ? JSON.parse(item)
      : defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

// Initial state based on your host schema
const initialState = {
  currentHost: safeParse("currentHost", null),
  hostsList: safeParse("hostsList", []),
  loading: false,
  error: null,
  status: "idle",
  listStatus: "idle",
  hasActiveHost: safeParse("hasActiveHost", false) // New state for tracking active host
};

// Async thunk for fetching host by ID
export const fetchHostById = createAsyncThunk("host/fetchHostById", async (hostId, {rejectWithValue}) => {
  try {
    const response = await getHostById(hostId);
    return response.data;
  } catch (error) {
    return rejectWithValue({
      message: error.message,
      status: error.response
        ?.status || 500
    });
  }
});

// Async thunk for fetching hosts by user ID
export const fetchHostsByUser = createAsyncThunk("host/fetchHostsByUser", async (userId, {rejectWithValue}) => {
  try {
    const response = await getHostsByUser(userId);
    return response.data; // This should be an array of hosts
  } catch (error) {
    return rejectWithValue({
      message: error.message,
      status: error.response
        ?.status || 500
    });
  }
});

const hostSlice = createSlice({
  name: "host",
  initialState,
  reducers: {
    // Add a new reducer to directly set hasActiveHost
    setHasActiveHost: (state, action) => {
      state.hasActiveHost = action.payload;
      localStorage.setItem("hasActiveHost", JSON.stringify(action.payload));
    },

    // Clear current host data
    clearHost: state => {
      state.currentHost = initialState.currentHost;
      localStorage.removeItem("currentHost");
    },

    // Clear hosts list data
    clearHostsList: state => {
      state.hostsList = initialState.hostsList;
      localStorage.removeItem("hostsList");
    },
    // Update specific host fields
    updateHostField: (state, action) => {
      const {field, value} = action.payload;
      if (field.includes(".")) {
        // Handle nested fields (e.g., 'address.city')
        const [parent, child] = field.split(".");
        state.currentHost[parent][child] = value;
      } else {
        state.currentHost[field] = value;
      }
      localStorage.setItem("currentHost", JSON.stringify(state.currentHost));
    },
    // Update host status
    updateHostStatus: (state, action) => {
      state.currentHost.status = action.payload;
      localStorage.setItem("currentHost", JSON.stringify(state.currentHost));
    },
    // Update address coordinates
    updateHostCoordinates: (state, action) => {
      state.currentHost.address.coordinates.coordinates = action.payload;
      localStorage.setItem("currentHost", JSON.stringify(state.currentHost));
    },
    // Clear errors
    clearHostError: state => {
      state.error = null;
    },
    // Reset to initial state
    resetHost: state => {
      state.currentHost = initialState.currentHost;
      state.hostsList = initialState.hostsList;
      state.loading = false;
      state.error = null;
      state.status = "idle";
      state.listStatus = "idle";
      localStorage.removeItem("currentHost");
      localStorage.removeItem("hostsList");
    }
  },
  extraReducers: builder => {
    builder
    // Fetch host by ID cases
      .addCase(fetchHostById.pending, state => {
      state.loading = true;
      state.error = null;
      state.status = "loading";
    }).addCase(fetchHostById.fulfilled, (state, action) => {
      state.loading = false;
      state.currentHost = action.payload;
      state.status = "succeeded";
      localStorage.setItem("currentHost", JSON.stringify(action.payload));
    }).addCase(fetchHostById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status = "failed";
    })

    // Fetch hosts by user cases
      .addCase(fetchHostsByUser.pending, state => {
      state.loading = true;
      state.error = null;
      state.listStatus = "loading";
    }).addCase(fetchHostsByUser.fulfilled, (state, action) => {
      state.loading = false;
      state.hostsList = action.payload;
      state.listStatus = "succeeded";
      state.hasActiveHost = action.payload.some(host => host.status === "active");
      localStorage.setItem("hostsList", JSON.stringify(action.payload));
    }).addCase(fetchHostsByUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.listStatus = "failed";
    });
  }
});

// Export actions
export const {
  clearHost,
  clearHostsList,
  updateHostField,
  updateHostStatus,
  updateHostCoordinates,
  clearHostError,
  resetHost
} = hostSlice.actions;

// Selectors
export const selectCurrentHost = state => state.host.currentHost;
export const selectHostsList = state => state.host.hostsList;
export const selectHostLoading = state => state.host.loading;
export const selectHostError = state => state.host.error;
export const selectHostStatus = state => state.host.status;
export const selectHostsListStatus = state => state.host.listStatus;
export const selectHasActiveHost = state => state.host.hasActiveHost;

// Detailed selectors for nested fields
export const selectHostAddress = state => state.host.currentHost.address;
export const selectHostCoordinates = state => state.host.currentHost.address.coordinates.coordinates;
export const selectHostPolicies = state => state.host.currentHost.policies;

export default hostSlice.reducer;