import LoadingSpinner from "../../../components/Ui/LoadingSpinner/LoadingSpinner";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Outlet } from "react-router-dom";
import {
  refreshUserToken,
  clearState,
} from "../../../stores/Slices/userSlices";
import { toast } from "react-toastify";

const ProtectedRoutes = ({ roles = [], children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get auth state from Redux
  const {
    isAuthenticated,
    userInfo,
    accessToken,
    refreshToken,
    isRefreshingToken,
  } = useSelector((state) => state.user);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // If no access token but refresh token exists, try to refresh
        if (!accessToken && refreshToken && !isRefreshingToken) {
          await dispatch(refreshUserToken(refreshToken)).unwrap();
        }

        // In ProtectedRoutes component
        if (roles.includes("unverified") && userInfo?.isEmailVerified) {
          navigate("/dashboard");
          return null;
        }

        //displaying loading spinner if any error occured
        if (isRefreshingToken || (!isAuthenticated && refreshToken)) {
          return (
            <div className="flex justify-center items-center h-screen">
              <LoadingSpinner text="Checking authentication..." />
            </div>
          );
        }

        // If still not authenticated after refresh attempt
        else if (!isAuthenticated) {
          throw new Error("Please login to access this page");
        }

        // Check role-based access if roles are specified
        if (roles.length > 0 && !roles.includes(userInfo?.role)) {
          throw new Error("You do not have permission to access this page");
        }
      } catch (error) {
        toast.error(error.message);
        dispatch(clearState());
        navigate("/login", { replace: true });
      }
    };

    checkAuth();
  }, [
    isAuthenticated,
    accessToken,
    refreshToken,
    userInfo,
    roles,
    dispatch,
    navigate,
    isRefreshingToken,
  ]);

  // Show loading state while checking auth/refreshing token
  if (isRefreshingToken || (!isAuthenticated && refreshToken)) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  // Render children if authenticated (and has required role if specified)
  return isAuthenticated ? children || <Outlet /> : null;
};

export default ProtectedRoutes;
