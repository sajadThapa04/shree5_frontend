import {describe, it, expect, beforeEach, vi} from "vitest";
import {configureStore} from "@reduxjs/toolkit";
import serviceReducer, {
  fetchServicesForHost,
  selectServices,
  selectServicesData,
  selectActiveService,
  selectServicesLoading,
  selectServicesError,
  selectServicesStatus,
  clearServices,
  setActiveService
} from "../stores/Slices/serviceSlice";
import {getServicesForHost} from "../services/services.api";

// Mock the API module
// Correct mock path - must match the import path exactly
vi.mock("../services/services.api", () => ({getServicesForHost: vi.fn()}));

describe("serviceSlice", () => {
  let store;
  let mockGetServicesForHost;

  const mockServices = [
    {
      _id: "service1",
      name: "Test Service 1",
      host: "host1",
      type: "restaurant"
    }, {
      _id: "service2",
      name: "Test Service 2",
      host: "host1",
      type: "hotel"
    }
  ];

  const mockApiResponse = {
    services: mockServices,
    count: mockServices.length
  };

  beforeEach(() => {
    // Get a fresh reference to the mock function
    mockGetServicesForHost = vi.mocked(getServicesForHost);

    // Reset all mocks
    vi.resetAllMocks();

    // Create fresh store
    store = configureStore({
      reducer: {
        services: serviceReducer
      }
    });
  });

  describe("initial state", () => {
    it("should have the correct initial state", () => {
      const state = store.getState().services;
      expect(state).toEqual({
        data: {
          services: [],
          count: 0
        },
        activeService: null,
        loading: false,
        error: null,
        status: "idle"
      });
    });
  });

  describe("reducers", () => {
    describe("clearServices", () => {
      it("should reset the state to initial values", () => {
        // First populate the state
        store.dispatch(setActiveService(mockServices[0]));
        store.dispatch(fetchServicesForHost.fulfilled(mockApiResponse));

        // Then clear it
        store.dispatch(clearServices());

        const state = store.getState().services;
        expect(state.data.services).toEqual([]);
        expect(state.data.count).toBe(0);
        expect(state.activeService).toBeNull();
        expect(state.loading).toBe(false);
        expect(state.error).toBeNull();
        expect(state.status).toBe("idle");
      });
    });

    describe("setActiveService", () => {
      it("should set activeService when payload is an object", () => {
        store.dispatch(setActiveService(mockServices[0]));

        const state = store.getState().services;
        expect(state.activeService).toEqual(mockServices[0]);
      });

      it("should set activeService when payload is a string ID and service exists", () => {
        // First populate services
        store.dispatch(fetchServicesForHost.fulfilled(mockApiResponse));

        // Then set active by ID
        store.dispatch(setActiveService("service2"));

        const state = store.getState().services;
        expect(state.activeService).toEqual(mockServices[1]);
      });

      it("should create a minimal activeService when payload is a string ID but service doesnt exist", () => {
        store.dispatch(setActiveService("nonexistent-id"));

        const state = store.getState().services;
        expect(state.activeService).toEqual({_id: "nonexistent-id"});
      });
    });
  });

  describe("async thunk fetchServicesForHost", () => {
    it("should handle pending state", () => {
      // Use the mocked reference
      mockGetServicesForHost.mockImplementationOnce(() => new Promise(() => {}));

      store.dispatch(fetchServicesForHost("host1"));

      const state = store.getState().services;
      expect(state.loading).toBe(true);
      expect(state.status).toBe("loading");
      expect(state.error).toBeNull();
    });

    it("should handle fulfilled state", async () => {
      mockGetServicesForHost.mockImplementationOnce(() => Promise.resolve({data: mockApiResponse}));

      await store.dispatch(fetchServicesForHost("host1"));

      const state = store.getState().services;
      expect(state.loading).toBe(false);
      expect(state.status).toBe("succeeded");
      expect(state.error).toBeNull();
      expect(state.data.services).toEqual(mockServices);
      expect(state.data.count).toBe(mockServices.length);
      expect(state.activeService).toEqual(mockServices[0]);
    });

    it("should handle rejected state", async () => {
      const errorMessage = "Failed to fetch services";
      mockGetServicesForHost.mockImplementationOnce(() => Promise.reject({
        response: {
          data: errorMessage
        }
      }));

      await store.dispatch(fetchServicesForHost("host1"));

      const state = store.getState().services;
      expect(state.loading).toBe(false);
      expect(state.status).toBe("failed");
      expect(state.error).toBe(errorMessage);
      expect(state.data.services).toEqual([]);
      expect(state.data.count).toBe(0);
    });

    it("should not change activeService if one already exists when fulfilled", async () => {
      store.dispatch(setActiveService(mockServices[1]));

      mockGetServicesForHost.mockImplementationOnce(() => Promise.resolve({data: mockApiResponse}));

      await store.dispatch(fetchServicesForHost("host1"));

      const state = store.getState().services;
      expect(state.activeService).toEqual(mockServices[1]);
    });
  });

  describe("selectors", () => {
    beforeEach(() => {
      // Populate the store with data
      store.dispatch(fetchServicesForHost.fulfilled(mockApiResponse));
      store.dispatch(setActiveService(mockServices[0]));
    });

    it("selectServices should return services array", () => {
      const result = selectServices(store.getState());
      expect(result).toEqual(mockServices);
    });

    it("selectServicesData should return complete data object", () => {
      const result = selectServicesData(store.getState());
      expect(result).toEqual(mockApiResponse);
    });

    it("selectActiveService should return the active service", () => {
      const result = selectActiveService(store.getState());
      expect(result).toEqual(mockServices[0]);
    });

    it("selectServicesLoading should return loading state", () => {
      const result = selectServicesLoading(store.getState());
      expect(result).toBe(false);
    });

    it("selectServicesError should return error state", () => {
      const result = selectServicesError(store.getState());
      expect(result).toBeNull();
    });

    it("selectServicesStatus should return status", () => {
      const result = selectServicesStatus(store.getState());
      expect(result).toBe("succeeded");
    });
  });
});