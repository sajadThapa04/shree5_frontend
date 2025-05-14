import React, { useEffect, useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import ServiceProfileCard from "../../../components/features/ServicesCard/ServiceProfileCard";
import { fetchServicesForHost } from "../../../stores/Slices/serviceSlice";
import {
  Button,
  ErrorMessage,
  SuccessMessage,
  LoadingSpinner,
} from "../../../components/Ui/index";
import {
  ArrowLeftIcon,
  HomeIcon,
  PlusIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

const ServiceProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { hostId } = useParams();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [hasShownSuccess, setHasShownSuccess] = useState(false);

  // Get user data
  const user = useSelector((state) => state.user.userInfo);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  // Get services data
  const services = useSelector((state) => state.services.data.services);
  const loading = useSelector((state) => state.services.loading);
  const serviceError = useSelector((state) => state.services.error);



  // Fetch services when component mounts or hostId changes
  const fetchServices = useCallback(async () => {
    if (hostId) {
      try {
        await dispatch(fetchServicesForHost(hostId));
        if (!hasShownSuccess) {
          setSuccess("Services loaded successfully");
          setHasShownSuccess(true);
        }
      } catch (err) {
        setError(err.message || "Failed to load services");
      }
    }
  }, [dispatch, hostId, hasShownSuccess]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Clear messages after timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setError(null);
      setSuccess(null);
    }, 2000);

    return () => clearTimeout(timer);
  }, [error, success]);

  const handleBack = () => navigate(-1);
  const handleCreateService = () => navigate("/create_service");
  const handleRefresh = () => {
    setHasShownSuccess(false);
    fetchServices();
  };

  // Handle navigation based on service type
  const handleServiceNavigation = (service) => {
    if (service.type === "restaurant") {
      navigate(`/services/${service._id}/restaurants`);
    } else {
      navigate(`/services/${service._id}/rooms`);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          <h3 className="font-bold">Authentication Required</h3>
          <p className="mb-4">Please log in to view services.</p>
          <Button variant="primary" onClick={() => navigate("/login")}>
            Login
          </Button>
        </div>
      </div>
    );
  }

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
          onClick={handleBack}
          icon={ArrowLeftIcon}
          iconPosition="left"
        >
          Back
        </Button>
        <div className="flex space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            icon={HomeIcon}
            iconPosition="right"
          >
            Home
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="space-y-3 mb-6">
        {error && <ErrorMessage message={error} />}
        {serviceError && <ErrorMessage message={serviceError} />}
        {success && <SuccessMessage message={success} />}
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {user?.hostProfile === hostId ? "My Services" : "Services"}
          </h1>
          <p className="text-gray-600 mb-8">
            {user?.hostProfile === hostId
              ? "Manage all services associated with your host profile"
              : "Viewing services for this host"}
          </p>

          {services && services.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {services.map((service) => (
                <motion.div
                  key={service._id}
                  whileHover={{
                    y: -2,
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <ServiceProfileCard
                    service={service}
                    onCreate={() => handleServiceNavigation(service)}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm p-6">
              <p className="text-gray-500 text-lg mb-4">
                No services found for this host
              </p>
              {user?.hostProfile === hostId && (
                <Button
                  variant="primary"
                  onClick={handleCreateService}
                  icon={PlusIcon}
                  iconPosition="left"
                >
                  Create Your First Service
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default ServiceProfile;
