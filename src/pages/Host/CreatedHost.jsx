import React, { useState, useEffect } from "react";
import { useCreateHost } from "../../hooks/hostApiHooks/useCreateHost";
import HostForm from "../../components/forms/HostForms/HostForm";
import { useNavigate } from "react-router-dom";
import {
  ErrorMessage,
  SuccessMessage,
} from "../../components/Ui/Message/AlertMessage";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { fetchUser } from "../../stores/Slices/userSlices";
import { useQueryClient } from "@tanstack/react-query";

const CreatedHost = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const {
    mutate: createHost,
    isLoading,
    error,
    isSuccess,
    data,
  } = useCreateHost();
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  // Handle success state
  useEffect(() => {
    // if (isSuccess && data?.data?._id) {
    if (isSuccess && data?.data?.user) {
      // Changed from data.data._id to data.data.user
      setShowSuccess(true);

      // Update user data in both Redux and React Query
      const updateUserData = async () => {
        try {
          // Option 1: Fetch fresh user data from server
          await dispatch(fetchUser());

          // Option 2: Optimistically update user data
          queryClient.setQueryData(["currentUser"], (oldData) => {
            return {
              ...oldData,
              role: "host",
              // hostProfile: data.data._id,
              hostProfile: data.data.user, // Changed to use user field
            };
          });

          // Invalidate queries to trigger refetch if needed
          queryClient.invalidateQueries(["currentUser"]);
        } catch (err) {
          console.error("Failed to update user data:", err);
        }
      };

      updateUserData();

      const successTimer = setTimeout(() => setShowSuccess(false), 2000);
      // const navigateTimer = setTimeout(() => {
      //   navigate(`/host/${data.data._id}`);
      // }, 3000);

      const navigateTimer = setTimeout(() => {
        navigate(`/host/user/${data.data.user}`); // Changed to use user route
      }, 3000);

      return () => {
        clearTimeout(successTimer);
        clearTimeout(navigateTimer);
      };
    }
  }, [isSuccess, data, navigate, dispatch, queryClient]);

  // Handle error state
  useEffect(() => {
    if (error) {
      setShowError(true);
      const errorTimer = setTimeout(() => setShowError(false), 3000);
      return () => clearTimeout(errorTimer);
    }
  }, [error]);

  const handleSubmit = async (formData) => {
    return new Promise((resolve, reject) => {
      createHost(formData, {
        onSuccess: (response) => resolve(response),
        onError: (error) => reject(error),
      });
    });
  };

  const handleDismissError = () => setShowError(false);
  const handleDismissSuccess = () => {
    setShowSuccess(false);
    // navigate(`/host/${data?.data?._id}`);
    navigate(`/host/user/${data?.data?.user}`); // Changed to use user route
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
        {showSuccess && (
          <SuccessMessage
            message="Host profile created successfully!"
            onDismiss={handleDismissSuccess}
          />
        )}

        {showError && error && (
          <ErrorMessage
            message={error.message || "Failed to create host profile"}
            onDismiss={handleDismissError}
          />
        )}

        <HostForm onSubmit={handleSubmit} isLoading={isLoading} error={null} />
      </motion.div>
    </motion.div>
  );
};

export default CreatedHost;
