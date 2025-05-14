import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import {
  ArrowPathIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import MapPicker from "../../../../MapPicker/MapPicker";

function Address() {
  const { setValue, watch } = useFormContext();
  const [isLocating, setIsLocating] = useState(true);
  const [locationError, setLocationError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [currentZoom, setCurrentZoom] = useState(12);
  const coordinates = watch("coordinates") || [0, 0];
  const address = watch("address") || {};

  useEffect(() => {
    if (navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords = {
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
            zoom: 14,
          };
          setUserLocation(userCoords);
          setValue("coordinates", [userCoords.longitude, userCoords.latitude], {
            shouldValidate: true,
            shouldDirty: true,
          });
          setIsLocating(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocationError(
            "Could not determine your location. Please select manually."
          );
          const defaultCoords = {
            longitude: 151.2061468,
            latitude: -33.8682602,
            zoom: 12,
          };
          setUserLocation(defaultCoords);
          setValue(
            "coordinates",
            [defaultCoords.longitude, defaultCoords.latitude],
            {
              shouldValidate: true,
              shouldDirty: true,
            }
          );
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setLocationError("Geolocation is not supported. Please select manually.");
      const defaultCoords = {
        longitude: 151.2061468,
        latitude: -33.8682602,
        zoom: 12,
      };
      setUserLocation(defaultCoords);
      setValue(
        "coordinates",
        [defaultCoords.longitude, defaultCoords.latitude],
        {
          shouldValidate: true,
          shouldDirty: true,
        }
      );
      setIsLocating(false);
    }
  }, [setValue]);

  const handleLocationSelect = (location) => {
    // Update coordinates
    setValue("coordinates", [location.lng, location.lat], {
      shouldValidate: true,
      shouldDirty: true,
    });

    // Update address fields if they exist in the location object
    if (location.address) {
      setValue(
        "address",
        {
          ...address,
          ...location.address,
        },
        {
          shouldValidate: true,
          shouldDirty: true,
        }
      );
    }

    setLocationError(null);
    setCurrentZoom(location.zoom || 14);
  };

  const formatCoordinate = (coord) => {
    if (typeof coord !== "number") return "0.00000";
    return coord.toFixed(5);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Property Location</h2>

      <div className="space-y-4">
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
        ) : (
          <div className="h-96 rounded-lg overflow-hidden relative">
            <MapPicker
              initialViewState={{
                longitude: coordinates[0] || 0,
                latitude: coordinates[1] || 0,
                zoom: userLocation?.zoom || 12,
              }}
              onLocationSelect={handleLocationSelect}
              showControls={true}
              onSearchResult={(result) => {
                const newCoords = [
                  result.geometry.location.lng(),
                  result.geometry.location.lat(),
                ];
                const addressComponents = {
                  country: result.address_components?.find((c) =>
                    c.types.includes("country")
                  )?.long_name,
                  city: result.address_components?.find(
                    (c) =>
                      c.types.includes("locality") ||
                      c.types.includes("administrative_area_level_2")
                  )?.long_name,
                  street: result.address_components?.find((c) =>
                    c.types.includes("route")
                  )?.long_name,
                  zipCode: result.address_components?.find((c) =>
                    c.types.includes("postal_code")
                  )?.long_name,
                };

                console.log(addressComponents);
                setValue("coordinates", newCoords, { shouldValidate: true });
                setValue(
                  "address",
                  {
                    ...address,
                    ...addressComponents,
                  },
                  { shouldValidate: true, shouldDirty: true }
                );
              }}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
          <div className="text-sm">
            <span className="font-medium text-gray-700">📍 Longitude:</span>
            <span className="ml-2 text-gray-600">
              {formatCoordinate(coordinates[0])}
            </span>
          </div>
          <div className="text-sm">
            <span className="font-medium text-gray-700">📍 Latitude:</span>
            <span className="ml-2 text-gray-600">
              {formatCoordinate(coordinates[1])}
            </span>
          </div>
          <div className="text-sm">
            <span className="font-medium text-gray-700">🔍 Zoom:</span>
            <span className="ml-2 text-gray-600">{currentZoom.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Address;
