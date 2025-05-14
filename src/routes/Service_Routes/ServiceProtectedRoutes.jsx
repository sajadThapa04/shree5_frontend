import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectHostsList } from "../../stores/Slices/hostSlice";
import { LoadingSpinner } from "../../components/Ui";

const ServiceProtectedRoutes = () => {
  const location = useLocation();
  const hostsList = useSelector(selectHostsList);
  const host = hostsList?.[0] || null; // Get first host or null if empty

  if (!host) {
    // If host data hasn't loaded yet, show loading spinner
    return <LoadingSpinner />;
  }

  if (host.status !== "active") {
    // Redirect to host profile with a message if host is not active
    return (
      <Navigate
        to={`/host/user/${host.user}`}
        state={{
          from: location,
          message: "Your host account needs to be active to access this page",
        }}
        replace
      />
    );
  }

  // If host is active, render the child routes
  return <Outlet />;
};

export default ServiceProtectedRoutes;
