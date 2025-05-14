import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {getAllRooms, getRoomById, getRoomsByService} from "../../services/room.api";

const initialState = {
  data: {
    rooms: [],
    count: 0,
    currentRoom: null
  },
  loading: false,
  error: null,
  status: "idle"
};

// Async thunk to fetch a single room by ID
export const fetchRoomById = createAsyncThunk("rooms/fetchById", async (id, {rejectWithValue}) => {
  try {
    const response = await getRoomById(id);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Async thunk to fetch rooms by service ID
export const fetchRoomsByService = createAsyncThunk("rooms/fetchByService", async (serviceId, {rejectWithValue}) => {
  try {
    const response = await getRoomsByService(serviceId);
    return {
      rooms: response.data,
      count: response.data
        ?.length || 0
    };
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Async thunk to fetch all rooms with filters
export const fetchAllRooms = createAsyncThunk("rooms/fetchAll", async (filters = {}, {rejectWithValue}) => {
  try {
    const response = await getAllRooms(filters);
    if (!response.success) {
      throw new Error(response.message || "Failed to fetch rooms");
    }
    return {
      rooms: response.data,
      count: Array.isArray(response.data)
        ? response.data.length
        : 0
    };
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const roomSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {
    clearRooms: state => {
      state.data.rooms = [];
      state.data.count = 0;
      state.data.currentRoom = null;
      state.loading = false;
      state.error = null;
      state.status = "idle";
    },
    setCurrentRoom: (state, action) => {
      if (typeof action.payload === "string") {
        state.data.currentRoom = state.data.rooms.find(r => r._id === action.payload) || {
          _id: action.payload
        };
      } else {
        state.data.currentRoom = action.payload;
      }
    }
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
      state.data.rooms = action.payload.rooms;
      state.data.count = action.payload.count;
      state.status = "succeeded";

      // Set current room if only one is returned and none is set
      if (action.payload.count === 1 && !state.data.currentRoom) {
        state.data.currentRoom = action.payload.rooms[0];
      }
    };

    // Common rejected state
    const rejectedState = (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status = "failed";
    };

    builder
    // Fetch room by ID
      .addCase(fetchRoomById.pending, pendingState).addCase(fetchRoomById.fulfilled, (state, action) => {
      state.loading = false;
      state.data.currentRoom = action.payload;
      state.status = "succeeded";

      if (!state.data.rooms.some(r => r._id === action.payload._id)) {
        state.data.rooms.push(action.payload);
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
export const selectRooms = state => state.rooms.data.rooms;
export const selectRoomsCount = state => state.rooms.data.count;
export const selectCurrentRoom = state => state.rooms.data.currentRoom;
export const selectRoomsLoading = state => state.rooms.loading;
export const selectRoomsError = state => state.rooms.error;
export const selectRoomsStatus = state => state.rooms.status;

export const {clearRooms, setCurrentRoom} = roomSlice.actions;
export default roomSlice.reducer;