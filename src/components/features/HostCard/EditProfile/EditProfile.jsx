import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { ErrorMessage, SuccessMessage } from "../../../Ui/Message/AlertMessage";
import {
  fetchHostsByUser,
  selectHostsList,
  selectHostLoading,
} from "../../../../stores/Slices/hostSlice";
import { useUpdateHost } from "../../../../hooks/hostApiHooks/useUpdateHost";
import EditProfileWizard from "./EditProfileWizard";

function EditProfile() {
  const { userId } = useParams(); // Changed from hostId to userId
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const hostsList = useSelector(selectHostsList);
  const host = hostsList?.[0] || null; // Get first host or null if empty
  const loading = useSelector(selectHostLoading);
  const { updateHost, isLoading, error, data, reset } = useUpdateHost();

  // State for controlling message visibility
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const methods = useForm({
    defaultValues: {
      name: "",
      description: "",
      phone: "",
      email: "",
      policies: {
        cancellation: "moderate",
      },
      address: {
        street: "",
        city: "",
        country: "",
      },
    },
  });

  const { reset: resetForm } = methods;

  useEffect(() => {
    if (userId) {
      dispatch(fetchHostsByUser(userId));
    }
  }, [userId, dispatch]);

  useEffect(() => {
    if (host) {
      resetForm({
        name: host.name || "",
        description: host.description || "",
        phone: host.phone || "",
        email: host.email || "",
        policies: {
          cancellation: host.policies?.cancellation || "moderate",
        },
        address: {
          street: host.address?.street || "",
          city: host.address?.city || "",
          country: host.address?.country || "",
        },
      });
    }
  }, [host, resetForm]);

  // Handle success message
  useEffect(() => {
    if (data) {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        setShowSuccess(false);
        navigate(`/host/user/${userId}`); // Redirect to profile after success
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [data, navigate, userId]);

  // Handle error message
  useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => setShowError(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const onSubmit = async (formData) => {
    try {
      if (host?._id) {
        await updateHost(host._id, formData); // Use host._id for the update
      }
    } catch (error) {
      // Error is already handled by the hook
    }
  };

  const handleBack = () => {
    navigate(`/host/user/${userId}`);
  };

  const handleDismissError = () => setShowError(false);
  const handleDismissSuccess = () => {
    setShowSuccess(false);
    navigate(`/host/user/${userId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-4 md:p-6 mt-10"
    >
      {/* Navigation */}
      <motion.button
        onClick={handleBack}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all duration-300 mb-6"
      >
        <ArrowLeftIcon className="h-5 w-5" />
        <span className="font-medium">Back to Profile</span>
      </motion.button>

      {/* Messages */}
      <div className="space-y-3 mb-6">
        {showError && (
          <ErrorMessage
            message={error?.message || "Failed to update host profile"}
            onDismiss={handleDismissError}
          />
        )}
        {showSuccess && (
          <SuccessMessage
            message="Host profile updated successfully!"
            onDismiss={handleDismissSuccess}
          />
        )}
      </div>

      {/* Form */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
        </div>
      ) : host ? (
        <FormProvider {...methods}>
          <EditProfileWizard
            onSubmit={onSubmit}
            isLoading={isLoading}
            initialValues={{
              name: host?.name || "",
              description: host?.description || "",
              phone: host?.phone || "",
              email: host?.email || "",
              address: {
                street: host?.address?.street || "",
                city: host?.address?.city || "",
                country: host?.address?.country || "",
              },
              policies: {
                cancellation: host?.policies?.cancellation || "moderate",
              },
            }}
          />
        </FormProvider>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm p-6">
          <p className="text-gray-500 text-lg mb-4">No host data available</p>
          <div className="flex justify-center gap-4">
            <Button
              variant="secondary"
              onClick={handleBack}
              className="w-full sm:w-auto"
            >
              Go Back
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate("/")}
              className="w-full sm:w-auto"
            >
              Go Home
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default EditProfile;
