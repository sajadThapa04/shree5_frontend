import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaUtensils,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaWifi,
  FaUmbrellaBeach,
  FaGlassMartiniAlt,
  FaParking
} from "react-icons/fa";
import { GiMeal } from "react-icons/gi";
import { Button } from "../../Ui";

const RestaurantLandingCard = ({ restaurant, serviceName, onBookNow }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showArrows, setShowArrows] = useState(false);

  const keyAmenityIcons = {
    wifi: <FaWifi className="h-4 w-4" />,
    outdoor: <FaUmbrellaBeach className="h-4 w-4" />,
    bar: <FaGlassMartiniAlt className="h-4 w-4" />,
    parking: <FaParking className="h-4 w-4" />,
  };

  if (!restaurant) return null;

  const {
    name,
    cuisineType,
    priceRange,
    rating,
    amenities = [],
    images = [],
    openingHours = [],
    isAvailable,
  } = restaurant;

  const displayedAmenities = amenities
    ? amenities.filter((amenity) => keyAmenityIcons[amenity]).slice(0, 4)
    : [];

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Check if restaurant is currently open
  const isCurrentlyOpen = () => {
    const today = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ][new Date().getDay()];

    const todayHours = openingHours?.find((day) => day?.day === today);
    if (
      !todayHours ||
      !todayHours.timeSlots ||
      todayHours.timeSlots.length === 0
    ) {
      return false;
    }

    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTime = currentHours * 60 + currentMinutes;

    return todayHours.timeSlots.some((slot) => {
      if (!slot.openingTime || !slot.closingTime) return false;

      const [openingHour, openingMinute] = slot.openingTime
        .split(":")
        .map(Number);
      const [closingHour, closingMinute] = slot.closingTime
        .split(":")
        .map(Number);

      const openingTime = openingHour * 60 + openingMinute;
      const closingTime = closingHour * 60 + closingMinute;

      return currentTime >= openingTime && currentTime <= closingTime;
    });
  };

  const actualAvailability = isAvailable && isCurrentlyOpen();

  const availabilityConfig = {
    true: {
      color: "bg-green-100 text-green-800",
      icon: FaCheckCircle,
      text: "Open Now",
    },
    false: {
      color: "bg-red-100 text-red-800",
      icon: FaTimesCircle,
      text: "Closed",
    },
  };

  const AvailabilityIcon =
    availabilityConfig[actualAvailability]?.icon || FaTimesCircle;
  const availabilityColor =
    availabilityConfig[actualAvailability]?.color || "bg-red-100 text-red-800";
  const availabilityText =
    availabilityConfig[actualAvailability]?.text || "Closed";

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      whileHover={{
        y: -5,
        boxShadow:
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      }}
      transition={{
        duration: 0.3,
        ease: "easeOut",
      }}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}
    >
      {/* Image Carousel */}
      <div className="h-48 overflow-hidden relative">
        {images && images.length > 0 ? (
          <>
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full"
            >
              <img
                src={images[currentImageIndex]}
                alt={serviceName || name}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Carousel Controls */}
            {images.length > 1 && showArrows && (
              <>
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition"
                  aria-label="Previous image"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaChevronLeft className="h-3 w-3" />
                </motion.button>

                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition"
                  aria-label="Next image"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaChevronRight className="h-3 w-3" />
                </motion.button>
              </>
            )}

            {/* Image Indicators */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`h-2 w-2 rounded-full transition-all duration-300 ${
                    index === currentImageIndex
                      ? "bg-white w-4"
                      : "bg-white bg-opacity-50"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <FaUtensils className="h-10 w-10 text-gray-400" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title and Rating */}
        <div className="flex justify-between items-start mb-2">
          <motion.h3
            className="text-lg font-semibold text-gray-900 line-clamp-1"
            whileHover={{
              x: 2,
              transition: { duration: 0.2 },
            }}
          >
            <span className="relative">
              {serviceName || name}
              <motion.span
                className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                style={{ originX: 0 }}
              />
            </span>
          </motion.h3>

          {rating && (
            <motion.div
              className="flex items-center bg-blue-50 px-2 py-1 rounded-full"
              whileHover={{ scale: 1.05 }}
            >
              <FaStar className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="text-sm font-medium">{rating.toFixed(1)}</span>
            </motion.div>
          )}
        </div>

        {/* Cuisine Type */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-1">
          {cuisineType?.join(", ") || "Various cuisines"}
        </p>

        {/* Key Details */}
        <div className="flex items-center space-x-4 mb-3 text-sm">
          <div className="flex items-center text-gray-600">
            <FaUtensils className="h-4 w-4 mr-1" />
            <span>{priceRange || "$$"}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <GiMeal className="h-4 w-4 mr-1" />
            <span>{cuisineType?.[0] || "International"}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <FaClock className="h-4 w-4 mr-1" />
            <span>{availabilityText}</span>
          </div>
        </div>

        {/* Amenities */}
        {displayedAmenities.length > 0 && (
          <div className="flex items-center space-x-3 mb-4">
            {displayedAmenities.map((amenity) => (
              <motion.div
                key={amenity}
                whileHover={{ scale: 1.2 }}
                className="text-gray-500 hover:text-blue-600 transition-colors"
                title={amenity.replace("_", " ")}
              >
                {keyAmenityIcons[amenity]}
              </motion.div>
            ))}
          </div>
        )}

        {/* Availability and Button */}
        <div className="flex items-center justify-between">
          <motion.span
            whileHover={{ scale: 1.05 }}
            className={`text-xs font-medium px-2 py-1 rounded ${availabilityColor}`}
          >
            <AvailabilityIcon className="h-3 w-3 inline mr-1" />
            {availabilityText}
          </motion.span>
          <Button
            onClick={() => onBookNow && onBookNow(restaurant._id)}
            variant="primary"
            size="small"
            disabled={!actualAvailability}
          >
            {actualAvailability ? "Reserve Table" : "Unavailable"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default RestaurantLandingCard;
