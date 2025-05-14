import React, { useEffect, useState, useCallback } from "react";
import UserCard from "../../components/features/UserCard/UserCard";
import AddAddress from "../../components/features/AddAddress/AddAddress";
import {
  ErrorMessage,
  SuccessMessage,
} from "../../components/Ui/Message/AlertMessage";
import { fetchUser } from "../../stores/Slices/userSlices";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Ui";
import {
  ArrowLeftIcon,
  HomeIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { useSelector, useDispatch } from "react-redux";

function UserProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Get user data from Redux store
  const {
    userInfo,
    loading,
    error: userError,
    isAuthenticated,
  } = useSelector((state) => state.user);

  // Memoized data loading function
  const loadUserData = useCallback(async () => {
    // Only fetch if we don't already have user info
    if (!userInfo && isAuthenticated) {
      try {
        setIsLoading(true);
        await dispatch(fetchUser());
        setSuccess("Profile loaded successfully");
      } catch (err) {
        console.error("Profile load error:", err);
        setError(err.message || "Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [dispatch, userInfo, isAuthenticated]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // Clear messages after timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setError(null);
      setSuccess(null);
    }, 2000);

    return () => clearTimeout(timer);
  }, [error, success]);

  // Handler functions
  const handleEditProfile = () => navigate("/profile/edit");
  const handleSendMessage = () =>
    navigate("/messages/new", { state: { recipient: userInfo } });
  const handleRetry = () => dispatch(fetchUser());

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-4 md:p-6"
    >
      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/")} // Or your default route
          icon={ArrowLeftIcon}
          iconPosition="left"
        >
          Back
        </Button>
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          icon={HomeIcon}
          iconPosition="right"
        >
          Home
        </Button>
      </div>

      {/* Messages */}
      <div className="space-y-3 mb-6">
        {error && <ErrorMessage message={error} />}
        {success && <SuccessMessage message={success} />}
      </div>

      {/* Main Content */}
      {isLoading || loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
        </div>
      ) : userError ? (
        <div className="text-center py-10">
          <p className="text-red-500 text-lg">{userError}</p>
          <Button variant="primary" onClick={handleRetry} className="mt-4">
            Retry
          </Button>
        </div>
      ) : userInfo ? (
        <>
          <h1 className="text-3xl font-bold text-gray-900 mb-6">My Profile</h1>
          <UserCard user={userInfo} />
          <AddAddress initialAddress={userInfo?.address || {}} />

          {/* Additional Profile Sections */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {userInfo.role === "host" && userInfo.hostProfile && (
              <Button
                variant="secondary"
                onClick={() => navigate(`/host/user/${userInfo._id}`)}
                className="w-full"
              >
                View Host Profile
              </Button>
            )}

            <Button
              variant="secondary"
              onClick={() => navigate("/bookings")}
              className="w-full"
              icon={CalendarIcon}
              iconPosition="left"
            >
              View My Bookings
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">No user data available</p>
          <Button
            variant="primary"
            onClick={() => navigate("/login")}
            className="mt-4"
          >
            Sign In
          </Button>
        </div>
      )}
    </motion.div>
  );
}

export default UserProfile;
