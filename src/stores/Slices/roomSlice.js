import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {getAllRooms, getRoomById, getRoomsByService} from "../../services/room.api";

// Helper function to safely load initial state if needed
const loadInitialRoomState = () => {
  return {
    data: {
      list: [], // Changed from 'rooms' to 'list' for consistency
      count: 0,
      currentRoom: null
    },
    loading: false,
    error: null,
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    lastFetched: null // Track when data was last fetched
  };
};

const initialState = loadInitialRoomState();

// Enhanced async thunks with better error handling
export const fetchRoomById = createAsyncThunk("rooms/fetchById", async (id, {rejectWithValue}) => {
  try {
    const response = await getRoomById(id);
    if (
      !response
      ?.success) {
      throw new Error(
        response
        ?.message || "Failed to fetch room");
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching room by ID:", error);
    return rejectWithValue({
      message: error.message,
      status: error.response
        ?.status || 500
    });
  }
});

export const fetchAllRooms = createAsyncThunk("rooms/fetchAll", async (filters = {}, {rejectWithValue}) => {
  try {
    const response = await getAllRooms(filters);
    if (!response.success) {
      throw new Error(response.message || "Failed to fetch rooms");
    }

    // Handle both possible response structures
    const roomsList = Array.isArray(
      response.data
      ?.rooms)
        ? response.data.rooms
        : Array.isArray(response.data)
          ? response.data
          : [];

    return {list: roomsList, count: roomsList.length};
  } catch (error) {
    return rejectWithValue({
      message: error.message,
      status: error.response
        ?.status || 500
    });
  }
});

export const fetchRoomsByService = createAsyncThunk("rooms/fetchByService", async (serviceId, {rejectWithValue}) => {
  try {
    const response = await getRoomsByService(serviceId);
    if (
      !response
      ?.success) {
      throw new Error(
        response
        ?.message || "Failed to fetch rooms by service");
    }

    // Handle both possible response structures
    const roomsList = Array.isArray(
      response.data
      ?.rooms)
        ? response.data.rooms
        : Array.isArray(response.data)
          ? response.data
          : [];

    return {list: roomsList, count: roomsList.length};
  } catch (error) {
    return rejectWithValue({
      message: error.message,
      status: error.response
        ?.status || 500
    });
  }
});

const roomSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {
    resetCurrentRoom: state => {
      state.currentRoom = null;
    },
    clearRooms: state => {
      state.data.list = [];
      state.data.count = 0;
      state.data.currentRoom = null;
      state.loading = false;
      state.error = null;
      state.status = "idle";
    },

    setCurrentRoom: (state, action) => {
      if (typeof action.payload === "string") {
        state.data.currentRoom = state.data.list.find(r => r._id === action.payload) || {
          _id: action.payload
        };
      } else {
        state.data.currentRoom = action.payload;
      }
    },
    clearError: state => {
      state.error = null;
    }
    // Add more reducers as needed
  },
  extraReducers: builder => {
    // Common pending state
    const pendingState = state => {
      state.loading = true;
      state.error = null;
      state.status = "loading";
    };

    // Common fulfilled state for room lists
    const fulfilledListState = (state, action) => {
      state.loading = false;
      state.data.list = action.payload.list;
      state.data.count = action.payload.count;
      state.status = "succeeded";
      state.lastFetched = Date.now();

      // Set current room if only one is returned and none is set
      if (action.payload.count === 1 && !state.data.currentRoom) {
        state.data.currentRoom = action.payload.list[0];
      }
    };

    // Common rejected state
    const rejectedState = (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status = "failed";
      console.error("Room fetch error:", action.payload);
    };

    builder
    // Fetch room by ID
      .addCase(fetchRoomById.pending, pendingState).addCase(fetchRoomById.fulfilled, (state, action) => {
      state.loading = false;
      state.data.currentRoom = action.payload;
      state.status = "succeeded";
      state.lastFetched = Date.now();

      if (!state.data.list.some(r => r._id === action.payload._id)) {
        state.data.list.push(action.payload);
        state.data.count += 1;
      }
    }).addCase(fetchRoomById.rejected, rejectedState)

    // Fetch rooms by service
      .addCase(fetchRoomsByService.pending, pendingState).addCase(fetchRoomsByService.fulfilled, fulfilledListState).addCase(fetchRoomsByService.rejected, rejectedState)

    // Fetch all rooms
      .addCase(fetchAllRooms.pending, pendingState).addCase(fetchAllRooms.fulfilled, fulfilledListState).addCase(fetchAllRooms.rejected, rejectedState);
  }
});

// Selectors
export const selectRooms = state => {
  const rooms = state.rooms.data.list;
  return Array.isArray(rooms)
    ? rooms
    : [];
};
export const selectRoomsCount = state => state.rooms.data.count || 0;
// ... other selectors remain the same
export const selectCurrentRoom = state => state.rooms.data.currentRoom;
export const selectRoomsLoading = state => state.rooms.loading;
export const selectRoomsError = state => state.rooms.error;
export const selectRoomsStatus = state => state.rooms.status;
export const selectLastFetched = state => state.rooms.lastFetched;

export const {clearRooms, setCurrentRoom, clearError, resetCurrentRoom} = roomSlice.actions;
export default roomSlice.reducer;