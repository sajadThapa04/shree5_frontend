import React, { useState } from "react";
import { Card } from "../../Ui";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBed,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaTimes,
  FaRulerCombined,
  FaUserFriends,
} from "react-icons/fa";
import {
  AmenetiesandTag,
  OpeningHoursCard,
  ServiceNameCard,
} from "./Components/index";

const RoomProfileCardById = ({ room, onBook, isLoading }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!room) {
    return (
      <div className="text-center p-4 text-gray-500">
        No room data available
      </div>
    );
  }

  const {
    name,
    roomType,
    description,
    openingHours,
    pricePerNight,
    capacity,
    size,
    amenities = [],
    tags = [],
    images = [],
    accommodationImages = [],
    isAvailable,
  } = room;

  // Check current availability
  const isCurrentlyAvailable = () => {
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
    if (!todayHours?.timeSlots?.length) return false;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    return todayHours.timeSlots.some((slot) => {
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

  const actualAvailability = isAvailable && isCurrentlyAvailable();

  const availabilityConfig = {
    true: {
      color: "bg-green-100 text-green-800",
      icon: FaCheckCircle,
      text: "Available Now",
    },
    false: {
      color: "bg-red-100 text-red-800",
      icon: FaTimesCircle,
      text: "Unavailable",
    },
  };

  const AvailabilityIcon =
    availabilityConfig[actualAvailability]?.icon || FaTimesCircle;
  const availabilityColor =
    availabilityConfig[actualAvailability]?.color || "bg-red-100 text-red-800";
  const availabilityText =
    availabilityConfig[actualAvailability]?.text || "Unavailable";

  return (
    <>
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage}
                alt="Enlarged room view"
                className="w-full max-h-[90vh] object-contain rounded-lg"
              />
              <button
                className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                onClick={() => setSelectedImage(null)}
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Card className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="flex flex-col lg:flex-row gap-8"
        >
          {/* Left Column - Images and Opening Hours */}
          <div className="flex-shrink-0 w-full lg:w-1/3 space-y-6">
            <ServiceNameCard
              serviceName={name}
              images={images}
              onImageClick={setSelectedImage}
              accommodationImages={accommodationImages}
            />
            <OpeningHoursCard openingHours={openingHours} />
          </div>

          {/* Right Column - Room Details */}
          <div className="flex-1 space-y-6">
            {/* Header with Status */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{name}</h2>
                {/* <p className="text-gray-600 capitalize">{roomType} Room</p> */}
              </div>
              <div className="flex flex-wrap gap-2">
                <span
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${availabilityColor}`}
                >
                  <AvailabilityIcon className="h-4 w-4 mr-1.5" />
                  {availabilityText}
                </span>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="flex flex-wrap gap-6 p-4 px-6 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <FaRulerCombined className="h-5 w-5 text-rose-500 mr-3" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Size</p>
                  <p className="font-medium text-gray-900">{size} sq.ft</p>
                </div>
              </div>
              <div className="flex items-center">
                <FaUserFriends className="h-5 w-5 text-rose-500 mr-3" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Capacity</p>
                  <p className="font-medium text-gray-900">
                    {capacity.adults} adults{" "}
                    {capacity.children > 0
                      ? `+ ${capacity.children} children`
                      : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <FaBed className="h-5 w-5 text-rose-500 mr-3" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Type</p>
                  <p className="font-medium text-gray-900 capitalize">
                    {roomType}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-900">
                Description
              </h3>
              <p className="text-gray-700">{description}</p>
            </div>

            {/* Amenities and Tags */}
            <AmenetiesandTag amenities={amenities} tags={tags} />

            {/* Price and Booking */}
            <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500">Starting from</p>
                <p className="text-2xl font-bold text-rose-600">
                  ${pricePerNight.toFixed(2)}{" "}
                  <span className="text-sm">/ night</span>
                </p>
              </div>
              {onBook && (
                <button
                  onClick={() => onBook(room)}
                  disabled={isLoading || !actualAvailability}
                  className={`px-6 py-3 rounded-lg text-base font-medium text-white ${
                    isLoading
                      ? "bg-gray-400"
                      : !actualAvailability
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600"
                  } transition-all duration-300 shadow-md`}
                >
                  {isLoading
                    ? "Processing..."
                    : !actualAvailability
                    ? "Not Available"
                    : "Book Now"}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </Card>
    </>
  );
};

export default RoomProfileCardById;
