import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {getRestaurantById, getRestaurantsByService, getAllRestaurants} from "../../services/restaurants.api";

const initialState = {
  data: {
    restaurants: [],
    count: 0,
    currentRestaurant: null
  },
  loading: false,
  error: null,
  status: "idle"
};

// Async thunk to fetch a single restaurant by ID
export const fetchRestaurantById = createAsyncThunk("restaurants/fetchById", async (id, {rejectWithValue}) => {
  try {
    const response = await getRestaurantById(id);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Async thunk to fetch restaurants by service ID
export const fetchRestaurantsByService = createAsyncThunk("restaurants/fetchByService", async (serviceId, {rejectWithValue}) => {
  try {
    const response = await getRestaurantsByService(serviceId);
    return {
      restaurants: response.data,
      count: response.data
        ?.length || 0
    };
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// New async thunk to fetch all restaurants with filters
export const fetchAllRestaurants = createAsyncThunk("restaurants/fetchAll", async (filters = {}, {rejectWithValue}) => {
  try {
    const response = await getAllRestaurants(filters);
    if (!response.success) {
      throw new Error(response.message || "Failed to fetch restaurants");
    }
    // Modified to handle direct array response
    const restaurantsData = Array.isArray(response.data)
      ? response.data
      : response.data
        ?.restaurants || [];
    return {restaurants: restaurantsData, count: restaurantsData.length};
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const restaurantSlice = createSlice({
  name: "restaurants",
  initialState,
  reducers: {
    clearRestaurants: state => {
      state.data.restaurants = [];
      state.data.count = 0;
      state.data.currentRestaurant = null;
      state.loading = false;
      state.error = null;
      state.status = "idle";
    },
    setCurrentRestaurant: (state, action) => {
      if (typeof action.payload === "string") {
        state.data.currentRestaurant = state.data.restaurants.find(r => r._id === action.payload) || {
          _id: action.payload
        };
      } else {
        state.data.currentRestaurant = action.payload;
      }
    },
    clearError: state => {
      state.error = null;
    }
  },
  extraReducers: builder => {
    // Common pending state
    const pendingState = state => {
      state.loading = true;
      state.error = null;
      state.status = "loading";
    };

    // Common fulfilled state for restaurant lists
    const fulfilledListState = (state, action) => {
      state.loading = false;
      state.data.restaurants = action.payload.restaurants;
      state.data.count = action.payload.count;
      state.status = "succeeded";

      // Set current restaurant if only one is returned and none is set
      if (action.payload.count === 1 && !state.data.currentRestaurant) {
        state.data.currentRestaurant = action.payload.restaurants[0];
      }
    };

    // Common rejected state
    const rejectedState = (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status = "failed";
    };

    builder
    // Fetch restaurant by ID
      .addCase(fetchRestaurantById.pending, pendingState).addCase(fetchRestaurantById.fulfilled, (state, action) => {
      state.loading = false;
      state.data.currentRestaurant = action.payload;
      state.status = "succeeded";

      if (!state.data.restaurants.some(r => r._id === action.payload._id)) {
        state.data.restaurants.push(action.payload);
        state.data.count += 1;
      }
    }).addCase(fetchRestaurantById.rejected, rejectedState)

    // Fetch restaurants by service
      .addCase(fetchRestaurantsByService.pending, pendingState).addCase(fetchRestaurantsByService.fulfilled, fulfilledListState).addCase(fetchRestaurantsByService.rejected, rejectedState)

    // Fetch all restaurants
      .addCase(fetchAllRestaurants.pending, pendingState).addCase(fetchAllRestaurants.fulfilled, fulfilledListState).addCase(fetchAllRestaurants.rejected, rejectedState);
  }
});

// Selectors
export const selectRestaurants = state => state.restaurants.data.restaurants;
export const selectRestaurantsCount = state => state.restaurants.data.count;
export const selectCurrentRestaurant = state => state.restaurants.data.currentRestaurant;
export const selectRestaurantsLoading = state => state.restaurants.loading;
export const selectRestaurantsError = state => state.restaurants.error;
export const selectRestaurantsStatus = state => state.restaurants.status;

export const {clearRestaurants, setCurrentRestaurant, clearError} = restaurantSlice.actions;
export default restaurantSlice.reducer;