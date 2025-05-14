import {describe, it, expect, beforeEach, vi} from "vitest";
import {configureStore} from "@reduxjs/toolkit";
import restaurantReducer, {
  fetchRestaurantById,
  fetchRestaurantsByService,
  selectRestaurants,
  selectRestaurantsCount,
  selectCurrentRestaurant,
  selectRestaurantsLoading,
  selectRestaurantsError,
  selectRestaurantsStatus,
  clearRestaurants,
  setCurrentRestaurant
} from "../stores/Slices/restaurantSlice";
import {getRestaurantById, getRestaurantsByService} from "../services/restaurants.api";

// Mock the API modules
vi.mock("../services/restaurants.api", () => ({getRestaurantById: vi.fn(), getRestaurantsByService: vi.fn()}));

describe("restaurantSlice", () => {
  let store;
  let mockGetRestaurantById;
  let mockGetRestaurantsByService;

  const mockRestaurants = [
    {
      _id: "restaurant1",
      name: "Test Restaurant 1",
      service: "service1",
      cuisine: "Italian"
    }, {
      _id: "restaurant2",
      name: "Test Restaurant 2",
      service: "service1",
      cuisine: "French"
    }
  ];

  const mockSingleRestaurant = {
    _id: "restaurant1",
    name: "Test Restaurant 1",
    service: "service1",
    cuisine: "Italian",
    menu: [],
    openingHours: []
  };

  const mockRestaurantsResponse = {
    restaurants: mockRestaurants,
    count: mockRestaurants.length
  };

  beforeEach(() => {
    // Get fresh references to the mock functions
    mockGetRestaurantById = vi.mocked(getRestaurantById);
    mockGetRestaurantsByService = vi.mocked(getRestaurantsByService);

    // Reset all mocks
    vi.resetAllMocks();

    // Create fresh store
    store = configureStore({
      reducer: {
        restaurants: restaurantReducer
      }
    });
  });

  describe("initial state", () => {
    it("should have the correct initial state", () => {
      const state = store.getState().restaurants;
      expect(state).toEqual({
        data: {
          restaurants: [],
          count: 0,
          currentRestaurant: null
        },
        loading: false,
        error: null,
        status: "idle"
      });
    });
  });

  describe("reducers", () => {
    describe("clearRestaurants", () => {
      it("should reset the state to initial values", () => {
        // First populate the state
        store.dispatch(setCurrentRestaurant(mockRestaurants[0]));
        store.dispatch(fetchRestaurantsByService.fulfilled(mockRestaurantsResponse));

        // Then clear it
        store.dispatch(clearRestaurants());

        const state = store.getState().restaurants;
        expect(state.data.restaurants).toEqual([]);
        expect(state.data.count).toBe(0);
        expect(state.data.currentRestaurant).toBeNull();
        expect(state.loading).toBe(false);
        expect(state.error).toBeNull();
        expect(state.status).toBe("idle");
      });
    });

    describe("setCurrentRestaurant", () => {
      it("should set currentRestaurant when payload is an object", () => {
        store.dispatch(setCurrentRestaurant(mockRestaurants[0]));

        const state = store.getState().restaurants;
        expect(state.data.currentRestaurant).toEqual(mockRestaurants[0]);
      });

      it("should set currentRestaurant when payload is a string ID and restaurant exists", () => {
        // First populate restaurants
        store.dispatch(fetchRestaurantsByService.fulfilled(mockRestaurantsResponse));

        // Then set current by ID
        store.dispatch(setCurrentRestaurant("restaurant2"));

        const state = store.getState().restaurants;
        expect(state.data.currentRestaurant).toEqual(mockRestaurants[1]);
      });

      it("should create a minimal currentRestaurant when payload is a string ID but restaurant doesnt exist", () => {
        store.dispatch(setCurrentRestaurant("nonexistent-id"));

        const state = store.getState().restaurants;
        expect(state.data.currentRestaurant).toEqual({_id: "nonexistent-id"});
      });
    });
  });

  describe("async thunks", () => {
    describe("fetchRestaurantById", () => {
      it("should handle pending state", () => {
        mockGetRestaurantById.mockImplementationOnce(() => new Promise(() => {}));

        store.dispatch(fetchRestaurantById("restaurant1"));

        const state = store.getState().restaurants;
        expect(state.loading).toBe(true);
        expect(state.status).toBe("loading");
        expect(state.error).toBeNull();
      });

      it("should handle fulfilled state", async () => {
        mockGetRestaurantById.mockImplementationOnce(() => Promise.resolve({data: mockSingleRestaurant}));

        await store.dispatch(fetchRestaurantById("restaurant1"));

        const state = store.getState().restaurants;
        expect(state.loading).toBe(false);
        expect(state.status).toBe("succeeded");
        expect(state.error).toBeNull();
        expect(state.data.currentRestaurant).toEqual(mockSingleRestaurant);
        expect(state.data.restaurants).toContainEqual(mockSingleRestaurant);
        expect(state.data.count).toBe(1);
      });

      it("should handle rejected state", async () => {
        const errorMessage = "Failed to fetch restaurant";
        mockGetRestaurantById.mockImplementationOnce(() => Promise.reject({
          response: {
            data: errorMessage
          }
        }));

        await store.dispatch(fetchRestaurantById("invalid-id"));

        const state = store.getState().restaurants;
        expect(state.loading).toBe(false);
        expect(state.status).toBe("failed");
        expect(state.error).toBe(errorMessage);
      });
    });

    describe("fetchRestaurantsByService", () => {
      it("should handle pending state", () => {
        mockGetRestaurantsByService.mockImplementationOnce(() => new Promise(() => {}));

        store.dispatch(fetchRestaurantsByService("service1"));

        const state = store.getState().restaurants;
        expect(state.loading).toBe(true);
        expect(state.status).toBe("loading");
        expect(state.error).toBeNull();
      });

      it("should handle fulfilled state", async () => {
        mockGetRestaurantsByService.mockImplementationOnce(() => Promise.resolve({data: mockRestaurants}));

        await store.dispatch(fetchRestaurantsByService("service1"));

        const state = store.getState().restaurants;
        expect(state.loading).toBe(false);
        expect(state.status).toBe("succeeded");
        expect(state.error).toBeNull();
        expect(state.data.restaurants).toEqual(mockRestaurants);
        expect(state.data.count).toBe(mockRestaurants.length);
        // Should auto-set first restaurant as current if none was set
        expect(state.data.currentRestaurant).toEqual(mockRestaurants[0]);
      });

      it("should not change currentRestaurant if one already exists when fulfilled", async () => {
        // First set a current restaurant
        store.dispatch(setCurrentRestaurant(mockRestaurants[1]));

        mockGetRestaurantsByService.mockImplementationOnce(() => Promise.resolve({data: mockRestaurants}));

        await store.dispatch(fetchRestaurantsByService("service1"));

        const state = store.getState().restaurants;
        // Should keep the previously set current restaurant
        expect(state.data.currentRestaurant).toEqual(mockRestaurants[1]);
      });

      it("should handle rejected state", async () => {
        const errorMessage = "Failed to fetch restaurants";
        mockGetRestaurantsByService.mockImplementationOnce(() => Promise.reject({
          response: {
            data: errorMessage
          }
        }));

        await store.dispatch(fetchRestaurantsByService("invalid-service"));

        const state = store.getState().restaurants;
        expect(state.loading).toBe(false);
        expect(state.status).toBe("failed");
        expect(state.error).toBe(errorMessage);
      });
    });
  });

  describe("selectors", () => {
    beforeEach(() => {
      // Populate the store with data
      store.dispatch(fetchRestaurantsByService.fulfilled(mockRestaurantsResponse));
      store.dispatch(setCurrentRestaurant(mockRestaurants[0]));
    });

    it("selectRestaurants should return restaurants array", () => {
      const result = selectRestaurants(store.getState());
      expect(result).toEqual(mockRestaurants);
    });

    it("selectRestaurantsCount should return count", () => {
      const result = selectRestaurantsCount(store.getState());
      expect(result).toBe(mockRestaurants.length);
    });

    it("selectCurrentRestaurant should return the current restaurant", () => {
      const result = selectCurrentRestaurant(store.getState());
      expect(result).toEqual(mockRestaurants[0]);
    });

    it("selectRestaurantsLoading should return loading state", () => {
      const result = selectRestaurantsLoading(store.getState());
      expect(result).toBe(false);
    });

    it("selectRestaurantsError should return error state", () => {
      const result = selectRestaurantsError(store.getState());
      expect(result).toBeNull();
    });

    it("selectRestaurantsStatus should return status", () => {
      const result = selectRestaurantsStatus(store.getState());
      expect(result).toBe("succeeded");
    });
  });
});