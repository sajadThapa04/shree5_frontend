import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import NavBar from "./navbar/NavBar";
import { logoutUsers } from "../../../stores/Slices/userSlices";
import {
  fetchHostsByUser,
  selectHasActiveHost,
} from "../../../stores/Slices/hostSlice";
// Import the service slice selectors
import {
  selectServices,
  selectActiveService,
  selectServicesLoading,
  selectServicesError,
  selectServicesStatus,
  fetchServicesForHost,
} from "../../../stores/Slices/serviceSlice";

function Headers() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userInfo);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const hasActiveHost = useSelector(selectHasActiveHost);

  // Test the service slice state
  const services = useSelector(selectServices);
  const activeService = useSelector(selectActiveService);
  const servicesLoading = useSelector(selectServicesLoading);
  const servicesError = useSelector(selectServicesError);
  const servicesStatus = useSelector(selectServicesStatus);

  // Fetch host data when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user?._id) {
      dispatch(fetchHostsByUser(user._id));

      // Test: Fetch services for the host
      if (user.hostProfile) {
        // Assuming hostProfile contains the host ID
        dispatch(fetchServicesForHost(user.hostProfile));
      }
    }
  }, [isAuthenticated, user?._id, user?.hostProfile, dispatch]);

  // Log the service slice state for testing
  useEffect(() => {
    console.log("--- Service Slice State ---");
    console.log("Services:", services);
    console.log("Active Service:", activeService);
    console.log("Loading:", servicesLoading);
    console.log("Error:", servicesError);
    console.log("Status:", servicesStatus);
  }, [services, activeService, servicesLoading, servicesError, servicesStatus]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUsers()).unwrap();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/login";
    }
  };

  return (
    <>
      <NavBar
        user={isAuthenticated ? user : null}
        onLogout={handleLogout}
        hasActiveHost={hasActiveHost}
      />
    </>
  );
}

export default Headers;
