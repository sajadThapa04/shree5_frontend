import React, { useState, useEffect } from "react";
import { useCreateService } from "../../../hooks/servicesApiHooks/useCreateService";
import ServicesForm from "../../../components/forms/ServicesForm/ServicesForm";
import { useNavigate } from "react-router-dom";
import {
  ErrorMessage,
  SuccessMessage,
} from "../../../components/Ui/Message/AlertMessage";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../../../stores/Slices/userSlices";
import { useQueryClient } from "@tanstack/react-query";
import {
  CheckBadgeIcon,
  ArrowLeftIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import { setActiveService } from "../../../stores/Slices/serviceSlice";
import { Button } from "../../../components/Ui";

const CreateServices = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    mutate: createService,
    isLoading,
    error,
    isSuccess,
    data: createdService,
    reset,
  } = useCreateService();

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [submissionState, setSubmissionState] = useState("idle");
  const [selectedServiceType, setSelectedServiceType] = useState("");

  const handleBack = () => navigate(-1);

  // Get success message based on service type
  const getSuccessMessage = () => {
    const serviceId = createdService?.data?._id;
    const baseRedirect = {
      title: "Service Created!",
      button: "Continue",
      state: { serviceId },
    };

    switch (selectedServiceType) {
      case "restaurant":
        return {
          ...baseRedirect,
          message: "Now let's set up your restaurant details.",
          redirect: "/create_restaurant",
        };
      case "hotel":
        return {
          ...baseRedirect,
          message: "Now let's set up your hotel details.",
          redirect: "/create_rooms",
          // redirect: "/create_hotel",
        };
      case "lodge":
        return {
          ...baseRedirect,
          message: "Now let's set up your lodge details.",
          redirect: "/create_rooms",
          // redirect: "/create_lodge",
        };
      case "home_stay":
        return {
          ...baseRedirect,
          message: "Now let's set up your home stay details.",
          redirect: "/create_rooms",
          // redirect: "/create_home_stay",
        };
      case "luxury_villa":
        return {
          ...baseRedirect,
          message: "Now let's set up your luxury villa details.",
          redirect: "/create_rooms",
          // redirect: "/create_villa",
        };
      default:
        return {
          ...baseRedirect,
          message: "Your service has been successfully created.",
          redirect: `/services/${serviceId}`,
        };
    }
  };

  const successContent = getSuccessMessage();

  // Handle success state
  useEffect(() => {
    if (isSuccess && createdService?.data?._id) {
      setSubmissionState("success");
      setShowSuccess(true);

      // Set the newly created service as active in Redux
      dispatch(setActiveService(createdService.data));

      // Update user data
      const updateUserData = async () => {
        try {
          await dispatch(fetchUser());
          queryClient.invalidateQueries(["currentUser"]);
        } catch (err) {
          console.error("Failed to update user data:", err);
        }
      };

      updateUserData();

      const successTimer = setTimeout(() => {
        setShowSuccess(false);
        navigate(successContent.redirect);
      }, 3000);

      return () => clearTimeout(successTimer);
    }
  }, [
    isSuccess,
    createdService,
    navigate,
    dispatch,
    queryClient,
    successContent.redirect,
  ]);

  // Handle error state
  useEffect(() => {
    if (error) {
      setSubmissionState("error");
      setShowError(true);

      const errorTimer = setTimeout(() => {
        setShowError(false);
        reset();
      }, 5000); // Increased timeout to 5 seconds

      return () => clearTimeout(errorTimer);
    }
  }, [error, reset]);

  const handleSubmit = async (formData) => {
    setSubmissionState("submitting");
    setSelectedServiceType(formData.type);

    try {
      await new Promise((resolve, reject) => {
        createService(formData, {
          onSuccess: resolve,
          onError: reject,
        });
      });
    } catch (err) {
      // Error is already handled by the error effect
      throw err;
    }
  };

  const handleDismissError = () => {
    setShowError(false);
    reset();
    setSubmissionState("idle");
  };

  const handleDismissSuccess = () => {
    setShowSuccess(false);
    if (createdService?.data?._id) {
      navigate(successContent.redirect);
    }
  };

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
        {/* Navigation Buttons - Removed center home button */}
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

        {/* Sticky Error Message at the top of the viewport */}
        {showError && (
          <div className="sticky top-4 z-40">
            <ErrorMessage
              message={error?.message || "Failed to create service"}
              onDismiss={handleDismissError}
              autoDismiss={true}
              dismissTime={5000}
            />
          </div>
        )}

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
                  {successContent.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {successContent.message}
                </p>
                <div className="mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDismissSuccess}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    {successContent.button}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {showSuccess && (
          <SuccessMessage
            message={`${successContent.title} ${successContent.message}`}
            onDismiss={handleDismissSuccess}
          />
        )}

        <ServicesForm
          onSubmit={handleSubmit}
          isLoading={isLoading || submissionState === "submitting"}
          error={error}
        />
      </motion.div>
    </motion.div>
  );
};

export default CreateServices;
