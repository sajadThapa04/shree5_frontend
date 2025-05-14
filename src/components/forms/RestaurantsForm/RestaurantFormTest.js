import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, Link } from "react-router-dom";
import {
  selectActiveService,
  selectServices,
} from "../../../stores/Slices/serviceSlice";
import RestaurantsWizard from "./RestaurantsWizard";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

const RestaurantsForm = ({ onSubmit, isLoading, error = null, serviceId }) => {
  const [selectedLocation, setSelectedLocation] = useState({
    longitude: 0,
    latitude: 0,
  });
  const [isLocating, setIsLocating] = useState(true);
  const activeService = useSelector(selectActiveService);
  const services = useSelector(selectServices);
  const location = useLocation();
  const serviceIdFromState = location.state?.serviceId;

  const effectiveServiceId = serviceId || serviceIdFromState;

  useEffect(() => {
    if (!effectiveServiceId) {
      console.warn("No service ID available");
    }
  }, [effectiveServiceId]);

  useEffect(() => {
    if (navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSelectedLocation({
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
          });
          setIsLocating(false);
        },
        () => {
          setIsLocating(false);
        }
      );
    } else {
      setIsLocating(false);
    }
  }, []);

  const handleSubmit = async (formData) => {
    if (!onSubmit || typeof onSubmit !== "function") {
      console.error("No valid onSubmit function provided");
      return Promise.reject(new Error("Form submission handler not available"));
    }

    const finalData = {
      ...formData,
      coordinates:
        formData.coordinates?.[0] !== 0
          ? formData.coordinates
          : [selectedLocation.longitude, selectedLocation.latitude],
      service: effectiveServiceId,
    };

    return onSubmit(finalData);
  };

  if (isLocating) {
    return (
      <div className="max-w-6xl mx-auto p-4 flex items-center justify-center h-64">
        <div className="text-center">
          <ArrowPathIcon className="h-10 w-10 mx-auto animate-spin text-rose-500" />
          <p className="mt-4 text-gray-600">Detecting your location...</p>
        </div>
      </div>
    );
  }

  if (!effectiveServiceId) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          <h3 className="font-bold">Missing Service Information</h3>
          <p className="mb-4">
            Please create a service first before adding a restaurant.
          </p>
          <Link
            to="/create_service"
            className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 inline-block"
          >
            Create Service
          </Link>
        </div>
      </div>
    );
  }

  // Additional check if service exists in the list
  const serviceExists = services.some((s) => s._id === effectiveServiceId);
  if (!serviceExists) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          <h3 className="font-bold">Invalid Service</h3>
          <p className="mb-4">
            The service you're trying to use doesn't exist or you don't have
            permission.
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

  return (
    <RestaurantsWizard
      onSubmit={handleSubmit}
      isLoading={isLoading}
      error={error}
      serviceId={effectiveServiceId}
    />
  );
};

export default RestaurantsForm;
