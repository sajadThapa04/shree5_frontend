// Headers.js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import NavBar from "./navbar/NavBar";
import { logoutUsers } from "../../../stores/Slices/userSlices";
import {
  fetchHostsByUser,
  selectHasActiveHost,
} from "../../../stores/Slices/hostSlice";

function Headers() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userInfo);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const hasActiveHost = useSelector(selectHasActiveHost);

  // Fetch host data when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user?._id) {
      dispatch(fetchHostsByUser(user._id));
    }
  }, [isAuthenticated, user?._id, dispatch]);

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
