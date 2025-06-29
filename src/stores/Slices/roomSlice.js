import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {getAllRooms, getRoomById, getRoomsByService} from "../../services/room.api";

const initialState = {
  data: {
    list: [],
    count: 0,
    currentRoom: null,
    hasMore: true
  },
  loading: false,
  error: null,
  status: "idle",
  lastFetched: null,
  currentPage: 1
};

// Async Thunks
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
    if (
      !response
      ?.success) {
      throw new Error(
        response
        ?.message || "Failed to fetch rooms");
    }

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

export const fetchRoomsPaginated = createAsyncThunk("rooms/fetchPaginated", async ({
  service,
  page = 1,
  limit = 12
}, {rejectWithValue}) => {
  try {
    const response = await getAllRooms({service, page, limit});
    if (
      !response
      ?.success) {
      throw new Error(
        response
        ?.message || "Failed to fetch rooms");
    }

    const roomsList = Array.isArray(
      response.data
      ?.rooms)
        ? response.data.rooms
        : Array.isArray(response.data)
          ? response.data
          : [];

    return {
      list: roomsList,
      count: response.data
        ?.totalCount || roomsList.length,
      hasMore: response.data
        ?.hasMore || roomsList.length >= limit,
      page
    };
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
      state.data.currentRoom = null;
    },
    clearRooms: state => {
      state.data.list = [];
      state.data.count = 0;
      state.data.currentRoom = null;
      state.data.hasMore = true;
      state.currentPage = 1;
      state.loading = false;
      state.error = null;
      state.status = "idle";
    },
    resetPagination: state => {
      state.data.list = [];
      state.data.hasMore = true;
      state.currentPage = 1;
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
  },
  extraReducers: builder => {
    builder.addCase(fetchRoomById.pending, state => {
      state.loading = true;
      state.error = null;
      state.status = "loading";
    }).addCase(fetchRoomById.fulfilled, (state, action) => {
      state.loading = false;
      state.data.currentRoom = action.payload;
      state.status = "succeeded";
      state.lastFetched = Date.now();

      if (!state.data.list.some(r => r._id === action.payload._id)) {
        state.data.list.push(action.payload);
        state.data.count += 1;
      }
    }).addCase(fetchRoomById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status = "failed";
    }).addCase(fetchRoomsByService.pending, state => {
      state.loading = true;
      state.error = null;
      state.status = "loading";
    }).addCase(fetchRoomsByService.fulfilled, (state, action) => {
      state.loading = false;
      state.data.list = action.payload.list;
      state.data.count = action.payload.count;
      state.status = "succeeded";
      state.lastFetched = Date.now();

      if (action.payload.count === 1 && !state.data.currentRoom) {
        state.data.currentRoom = action.payload.list[0];
      }
    }).addCase(fetchRoomsByService.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status = "failed";
    }).addCase(fetchAllRooms.pending, state => {
      state.loading = true;
      state.error = null;
      state.status = "loading";
    }).addCase(fetchAllRooms.fulfilled, (state, action) => {
      state.loading = false;
      state.data.list = action.payload.list;
      state.data.count = action.payload.count;
      state.status = "succeeded";
      state.lastFetched = Date.now();
    }).addCase(fetchAllRooms.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status = "failed";
    }).addCase(fetchRoomsPaginated.pending, state => {
      state.loading = true;
      state.error = null;
      state.status = "loading";
    }).addCase(fetchRoomsPaginated.fulfilled, (state, action) => {
      state.loading = false;
      state.data.list = action.payload.page === 1
        ? action.payload.list
        : [
          ...state.data.list,
          ...action.payload.list
        ];
      state.data.count = action.payload.count;
      state.data.hasMore = action.payload.hasMore;
      state.currentPage = action.payload.page;
      state.status = "succeeded";
      state.lastFetched = Date.now();
    }).addCase(fetchRoomsPaginated.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status = "failed";
    });
  }
});

// Selectors
export const selectRooms = state => state.rooms.data.list;
export const selectRoomsCount = state => state.rooms.data.count;
export const selectCurrentRoom = state => state.rooms.data.currentRoom;
export const selectRoomsLoading = state => state.rooms.loading;
export const selectRoomsError = state => state.rooms.error;
export const selectRoomsStatus = state => state.rooms.status;
export const selectLastFetched = state => state.rooms.lastFetched;
export const selectHasMore = state => state.rooms.data.hasMore;
export const selectCurrentPage = state => state.rooms.currentPage;

// Actions
export const {resetCurrentRoom, clearRooms, resetPagination, setCurrentRoom, clearError} = roomSlice.actions;

export default roomSlice.reducer;