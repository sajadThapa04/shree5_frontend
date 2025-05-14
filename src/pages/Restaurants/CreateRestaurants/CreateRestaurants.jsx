import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCreateRestaurant } from "../../../hooks/RestaurantsApiHooks/useCreateRestaurants";
import RestaurantsForm from "../../../components/forms/RestaurantsForm/RestaurantsForm";
import { useNavigate, Link } from "react-router-dom";
import { fetchUser } from "../../../stores/Slices/userSlices";
import {
  selectActiveService,
  selectServicesLoading,
  fetchServicesForHost,
  selectServices,
} from "../../../stores/Slices/serviceSlice";
import { CheckBadgeIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import {
  ErrorMessage,
  SuccessMessage,
} from "../../../components/Ui/Message/AlertMessage";
import { LoadingSpinner } from "../../../components/Ui";

const CreateRestaurant = () => {
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
    mutate: createRestaurant,
    isLoading: isCreating,
    error,
    isSuccess,
    data,
    reset,
  } = useCreateRestaurant();

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [submissionState, setSubmissionState] = useState("idle");

  // Fetch services when component mounts or user changes
  useEffect(() => {
    if (isAuthenticated && user?.hostProfile) {
      dispatch(fetchServicesForHost(user.hostProfile));
    }
  }, [isAuthenticated, user?.hostProfile, dispatch]);

  // Handle success state - MODIFIED to check for errors first
  useEffect(() => {
    if (isSuccess && data?.data?._id && !error) {
      setSubmissionState("success");
      setShowSuccess(true);

      // Update user data
      dispatch(fetchUser());

      // Show success for 3 seconds before redirecting to the service's restaurant profile
      const successTimer = setTimeout(() => {
        setShowSuccess(false);
        navigate(`/services/${activeService._id}/restaurants`);
      }, 3000);

      return () => clearTimeout(successTimer);
    }
  }, [isSuccess, data, error, navigate, dispatch, activeService?._id]);

  // Handle error state - ENHANCED to show proper error messages
  useEffect(() => {
    if (error) {
      setSubmissionState("error");
      setShowError(true);

      // For duplicate restaurant errors, show longer
      const isDuplicateError = error.message.includes(
        "already exists at this location"
      );
      const timeoutDuration = isDuplicateError ? 5000 : 3000;

      const errorTimer = setTimeout(() => {
        setShowError(false);
        reset();
      }, timeoutDuration);

      return () => clearTimeout(errorTimer);
    }
  }, [error, reset]);

  // Modified handleSubmit to reset states properly
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

      const payload = {
        ...formData,
        service: activeService._id,
      };

      await createRestaurant(payload);
    } catch (err) {
      console.error("Submission error:", err);
      // Error will be caught by the error useEffect
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
      navigate(`/restaurants/${data.data._id}`);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          <h3 className="font-bold">Authentication Required</h3>
          <p className="mb-4">Please log in to create a restaurant.</p>
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
            You need to create a host profile before creating a restaurant.
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
            You need to create a service before you can create a restaurant.
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
                  Restaurant Created Successfully!
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Your restaurant has been successfully published.
                </p>
                <div className="mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDismissSuccess}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    View Restaurant
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {showSuccess && (
          <SuccessMessage
            message="Restaurant created successfully!"
            onDismiss={handleDismissSuccess}
          />
        )}

        {/* {showError && (
          <ErrorMessage
            message={error?.message || "Failed to create restaurant"}
            onDismiss={handleDismissError}
          />
        )} */}

        <RestaurantsForm
          onSubmit={handleSubmit}
          isLoading={isCreating || submissionState === "submitting"}
          error={error}
          serviceId={activeService._id}
        />
      </motion.div>
    </motion.div>
  );
};

export default CreateRestaurant;
