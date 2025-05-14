import React, { useState, useEffect } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import ServicesFormWizard from "./ServicesWizard";

const ServicesForm = ({ onSubmit, isLoading }) => {
  const [selectedLocation, setSelectedLocation] = useState({
    longitude: 0,
    latitude: 0,
  });
  const [isLocating, setIsLocating] = useState(true);

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

  return <ServicesFormWizard onSubmit={handleSubmit} isLoading={isLoading} />;
};

export default ServicesForm;
