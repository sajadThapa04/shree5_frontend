// Location.jsx
import React, { useState, useEffect } from "react";
import MapPicker from "../../../MapPicker/MapPicker";
import {
  ArrowPathIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

function Location({ watch, setValue }) {
  const coordinates = watch("coordinates") || [0, 0];
  const [isLocating, setIsLocating] = useState(true);
  const [locationError, setLocationError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords = {
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
            zoom: 14, // Zoom in more for better precision
          };
          setUserLocation(userCoords);
          setValue("coordinates", [userCoords.longitude, userCoords.latitude]);
          setIsLocating(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocationError(
            "Could not determine your location. Please select manually."
          );
          // Fallback to default coordinates (Kathmandu)
          const defaultCoords = {
            longitude: 85.324,
            latitude: 27.7172,
            zoom: 12,
          };
          setUserLocation(defaultCoords);
          setValue("coordinates", [
            defaultCoords.longitude,
            defaultCoords.latitude,
          ]);
          setIsLocating(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      setLocationError(
        "Geolocation is not supported by your browser. Please select manually."
      );
      // Fallback to default coordinates (Kathmandu)
      const defaultCoords = {
        longitude: 85.324,
        latitude: 27.7172,
        zoom: 12,
      };
      setUserLocation(defaultCoords);
      setValue("coordinates", [
        defaultCoords.longitude,
        defaultCoords.latitude,
      ]);
      setIsLocating(false);
    }
  }, [setValue]);

  const handleLocationSelect = (location) => {
    setValue("coordinates", [location.lng, location.lat]);
    setLocationError(null); // Clear any previous errors if user selects manually
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Property Location</h2>

      {locationError && (
        <div className="flex items-center p-3 bg-yellow-50 text-yellow-700 rounded-md text-sm">
          <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
          {locationError}
        </div>
      )}

      {isLocating ? (
        <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <ArrowPathIcon className="h-10 w-10 mx-auto animate-spin text-rose-500" />
            <p className="mt-3 text-gray-600">Detecting your location...</p>
          </div>
        </div>
      ) : userLocation ? (
        <div className="h-96 rounded-lg overflow-hidden border border-gray-200">
          <MapPicker
            initialViewState={{
              longitude: userLocation.longitude,
              latitude: userLocation.latitude,
              zoom: userLocation.zoom,
            }}
            onLocationSelect={handleLocationSelect}
          />
        </div>
      ) : (
        <div className="h-96 rounded-lg overflow-hidden border border-gray-200">
          <MapPicker
            initialViewState={{
              longitude: coordinates[0],
              latitude: coordinates[1],
              zoom: 12,
            }}
            onLocationSelect={handleLocationSelect}
          />
        </div>
      )}

      <div className="text-sm text-gray-500 mt-2">
        {coordinates[0] !== 0 && coordinates[1] !== 0 ? (
          <>
            <span className="font-medium">Selected location:</span>
            <span className="ml-2">
              Lat: {coordinates[1].toFixed(6)}, Lng: {coordinates[0].toFixed(6)}
            </span>
          </>
        ) : (
          "Please select a location on the map"
        )}
      </div>
    </div>
  );
}

export default Location;
