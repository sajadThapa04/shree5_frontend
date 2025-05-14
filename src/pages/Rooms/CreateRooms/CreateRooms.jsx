import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useCreateRoom } from "../../../hooks/RoomsApiHooks/useCreateRooms";
import RoomForm from "../../../components/forms/RoomsForm/RoomForm";
import { fetchUser } from "../../../stores/Slices/userSlices";
import {
  selectActiveService,
  selectServicesLoading,
  fetchServicesForHost,
  selectServices,
} from "../../../stores/Slices/serviceSlice";
import {
  CheckBadgeIcon,
  ArrowLeftIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import {
  ErrorMessage,
  SuccessMessage,
} from "../../../components/Ui/Message/AlertMessage";
import { LoadingSpinner } from "../../../components/Ui";
import { Button } from "../../../components/Ui";

const CreateRooms = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get user data
  const user = useSelector((state) => state.user.userInfo);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  // Get services data
  const services = useSelector(selectServices);
  const activeService = useSelector(selectActiveService);
  const servicesLoading = useSelector(selectServicesLoading);
  const servicesError = useSelector((state) => state.services.error);

  const {
    mutate: createRoom,
    isLoading: isCreating,
    error,
    isSuccess,
    data,
    reset,
  } = useCreateRoom();

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [submissionState, setSubmissionState] = useState("idle");

  const handleBack = () => navigate(-1);

  // Fetch services when component mounts or user changes
  useEffect(() => {
    if (isAuthenticated && user?.hostProfile) {
      dispatch(fetchServicesForHost(user.hostProfile));
    }
  }, [isAuthenticated, user?.hostProfile, dispatch]);

  // Handle success state
  useEffect(() => {
    if (isSuccess && data?.data?._id && !error) {
      setSubmissionState("success");
      setShowSuccess(true);

      // Update user data
      dispatch(fetchUser());

      // Show success for 3 seconds before redirecting
      const successTimer = setTimeout(() => {
        setShowSuccess(false);
        navigate(`/services/${activeService._id}/rooms`);
      }, 3000);

      return () => clearTimeout(successTimer);
    }
  }, [isSuccess, data, error, navigate, dispatch, activeService?._id]);

  // Handle error state
  useEffect(() => {
    if (error) {
      setSubmissionState("error");
      setShowError(true);

      const errorTimer = setTimeout(() => {
        setShowError(false);
        reset();
      }, 3000);

      return () => clearTimeout(errorTimer);
    }
  }, [error, reset]);

  const handleSubmit = async (formData) => {
    try {
      if (!activeService?._id) {
        throw new Error("No valid service selected");
      }

      // Reset states before new submission
      setSubmissionState("submitting");
      setShowSuccess(false);
      setShowError(false);
      reset();

      // Transform openingHours to match backend expectation
      const transformedOpeningHours = Object.entries(
        formData.openingHours || {}
      ).map(([day, slots]) => ({
        day: day.toLowerCase(),
        timeSlots: slots.map((slot) => ({
          openingTime: slot.openingTime,
          closingTime: slot.closingTime,
        })),
      }));

      const payload = {
        ...formData,
        service: activeService._id,
        openingHours: transformedOpeningHours,
      };

      await createRoom(payload);
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  const handleDismissError = () => {
    setShowError(false);
    reset();
    setSubmissionState("idle");
  };

  const handleDismissSuccess = () => {
    setShowSuccess(false);
    if (data?.data?._id) {
      navigate(`/rooms/${data.data._id}`);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          <h3 className="font-bold">Authentication Required</h3>
          <p className="mb-4">Please log in to create a room.</p>
          <Link
            to="/login"
            className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 inline-block"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (!user?.hostProfile) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          <h3 className="font-bold">Host Profile Required</h3>
          <p className="mb-4">
            You need to create a host profile before creating a room.
          </p>
          <Link
            to="/create_host"
            className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 inline-block"
          >
            Create Host Profile
          </Link>
        </div>
      </div>
    );
  }

  if (servicesLoading) {
    return <LoadingSpinner />;
  }

  if (servicesError) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          <h3 className="font-bold">Error Loading Services</h3>
          <p className="mb-4">{servicesError}</p>
          <button
            onClick={() => dispatch(fetchServicesForHost(user.hostProfile))}
            className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 inline-block"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!services?.length) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          <h3 className="font-bold">No Services Found</h3>
          <p className="mb-4">
            You need to create a service before you can create a room.
          </p>
          <Link
            to="/create_service"
            className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 inline-block"
          >
            Create New Service
          </Link>
        </div>
      </div>
    );
  }

  if (!activeService) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          <h3 className="font-bold">No Active Service</h3>
          <p className="mb-4">Please select an active service to continue.</p>
          <Link
            to="/services"
            className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 inline-block"
          >
            Select Service
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-4xl space-y-4"
      >
        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="ghost"
            onClick={handleBack}
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

        <AnimatePresence>
          {submissionState === "success" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="bg-white p-8 rounded-xl shadow-xl text-center max-w-md"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1 }}
                  className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100"
                >
                  <CheckBadgeIcon className="h-10 w-10 text-green-600" />
                </motion.div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  Room Created Successfully!
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Your room has been successfully published.
                </p>
                <div className="mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDismissSuccess}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    View Room
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {showSuccess && (
          <SuccessMessage
            message="Room created successfully!"
            onDismiss={handleDismissSuccess}
          />
        )}

        {showError && (
          <ErrorMessage
            message={error?.message || "Failed to create room"}
            onDismiss={handleDismissError}
          />
        )}

        <RoomForm
          onSubmit={handleSubmit}
          isSubmitting={isCreating || submissionState === "submitting"}
          backLink={`/services/${activeService._id}`}
        />
      </motion.div>
    </motion.div>
  );
};

export default CreateRooms;
