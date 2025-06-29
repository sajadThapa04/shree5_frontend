import React, { useState } from "react";
import { Card } from "../../Ui";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUtensils,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaTimes,
  FaShoppingCart,
} from "react-icons/fa";
import { GiMeal, GiPartyPopper } from "react-icons/gi";
import {
  Ameneties,
  SeatingCapacity,
  ServiceNameCard,
  OpeningTimeCard,
} from "./Components/index";

const RestaurantProfileCardById = ({ restaurant, onReserve, isLoading }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showAllMenuItems, setShowAllMenuItems] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  if (!restaurant) {
    return (
      <div className="text-center p-4 text-gray-500">
        No restaurant data available
      </div>
    );
  }

  const {
    serviceName,
    description = "",
    cuisineDetails = [],
    seatingCapacity,
    amenities = [],
    openingHours = [],
    images = [],
    isAvailable,
    priceRange = "$$",
  } = restaurant;

  // Add item to cart
  const addToCart = (item) => {
    setCartItems([...cartItems, item]);
  };

  // Remove item from cart
  const removeFromCart = (index) => {
    const newCart = [...cartItems];
    newCart.splice(index, 1);
    setCartItems(newCart);
  };

  // Convert time to AM/PM format
  const formatTimeToAMPM = (time) => {
    if (!time) return "";

    const [hours, minutes] = time.split(":");
    const hourNum = parseInt(hours, 10);

    if (hourNum === 0) return `12:${minutes} AM`;
    if (hourNum === 12) return `12:${minutes} PM`;

    const ampm = hourNum >= 12 ? "PM" : "AM";
    const hour12 = hourNum % 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Check current availability with AM/PM formatting
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
    if (!todayHours?.timeSlots?.length) return false;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    return todayHours.timeSlots.some((slot) => {
      const [openingHour, openingMinute] = slot.openingTime
        ?.split(":")
        .map(Number) || [0, 0];
      const [closingHour, closingMinute] = slot.closingTime
        ?.split(":")
        .map(Number) || [0, 0];
      const openingTime = openingHour * 60 + openingMinute;
      const closingTime = closingHour * 60 + closingMinute;

      // Special case for 24-hour opening
      if (openingHour === 0 && closingHour === 23 && closingMinute === 59) {
        return true;
      }

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
  const timeSlots = todayHours?.timeSlots || [];

  const formatTimeSlots = (slots) => {
    if (!slots || slots.length === 0) return "Closed";

    // Check for 24-hour opening
    const is24Hours = slots.some(
      (slot) => slot?.openingTime === "00:00" && slot?.closingTime === "23:59"
    );

    if (is24Hours) return "Open 24 hours";

    return slots
      .filter((slot) => slot?.openingTime && slot?.closingTime)
      .map(
        (slot) =>
          `${formatTimeToAMPM(slot.openingTime)} - ${formatTimeToAMPM(
            slot.closingTime
          )}`
      )
      .join(" & ");
  };

  const displayedMenuItems = showAllMenuItems
    ? cuisineDetails
    : cuisineDetails.slice(0, 5);

  // Calculate total cart amount
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0);

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
                alt="Enlarged restaurant view"
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
              serviceName={serviceName}
              images={images}
              onImageClick={setSelectedImage}
            />
            <OpeningTimeCard openingHours={openingHours} />
          </div>

          {/* Right Column - Restaurant Details */}
          <div className="flex-1 space-y-6">
            {/* Header with Status */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {serviceName}
                </h2>
                <p className="text-gray-600">Restaurant & Bar</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${availabilityColor}`}
                >
                  <AvailabilityIcon className="h-4 w-4 mr-1.5" />
                  {availabilityText}
                </span>
                {timeSlots.length > 0 && (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    <FaClock className="h-4 w-4 mr-1.5" />
                    {formatTimeSlots(timeSlots)}
                  </span>
                )}
              </div>
            </div>

            {/* Stats Bar */}
            <div className="flex flex-wrap gap-6 p-4 px-6 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <GiMeal className="h-5 w-5 text-rose-500 mr-3" />
                <div>
                  <p className="text-xs font-medium text-gray-500">
                    Menu Items
                  </p>
                  <p className="font-medium text-gray-900">
                    {cuisineDetails.length}
                  </p>
                </div>
              </div>
              <SeatingCapacity capacity={seatingCapacity} />
              <div className="flex items-center">
                <GiPartyPopper className="h-5 w-5 text-rose-500 mr-3" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Amenities</p>
                  <p className="font-medium text-gray-900">
                    {amenities.length}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            {description && (
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-900">
                  About Us
                </h3>
                <p className="text-gray-700 whitespace-pre-line">
                  {description}
                </p>
              </div>
            )}

            {/* Menu Section with Scrollable Items */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                Menu Highlights
              </h3>
              <div
                className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2"
                style={{ scrollbarWidth: "thin" }}
              >
                {displayedMenuItems.map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -2 }}
                    className="flex gap-4 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div
                      className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-gray-100 cursor-pointer"
                      onClick={() => item.image && setSelectedImage(item.image)}
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <FaUtensils className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 capitalize">
                        {item.name}
                      </h4>
                      <p className="text-rose-600 font-semibold">
                        ${item.price.toFixed(2)}
                      </p>
                      {item.description && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                      <button
                        onClick={() => addToCart(item)}
                        className="mt-2 text-xs text-rose-500 hover:text-rose-700 font-medium flex items-center gap-1"
                      >
                        <FaShoppingCart className="h-3 w-3" />
                        Add to order
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
              {cuisineDetails.length > 5 && (
                <button
                  onClick={() => setShowAllMenuItems(!showAllMenuItems)}
                  className="text-sm text-rose-600 hover:text-rose-800 font-medium mt-2"
                >
                  {showAllMenuItems
                    ? "Show Less"
                    : `Show All (${cuisineDetails.length})`}
                </button>
              )}
            </div>

            {/* Shopping Cart Summary */}
            {cartItems.length > 0 && (
              <div className="bg-rose-50 p-4 rounded-lg border border-rose-100">
                <h3 className="text-lg font-semibold text-rose-800 mb-2">
                  Your Order
                </h3>
                <div className="max-h-40 overflow-y-auto mb-3">
                  {cartItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 border-b border-rose-100"
                    >
                      <span className="text-sm text-rose-900">{item.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-rose-800">
                          ${item.price.toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeFromCart(index)}
                          className="text-xs text-rose-500 hover:text-rose-700"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center font-medium text-rose-900">
                  <span>Total:</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* Amenities */}
            <Ameneties amenities={amenities} />

            {/* Reservation Button */}
            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={() => onReserve(restaurant)}
                disabled={
                  isLoading || !actualAvailability || cartItems.length === 0
                }
                className={`w-full px-6 py-3 rounded-lg text-base font-medium text-white ${
                  isLoading
                    ? "bg-gray-400"
                    : !actualAvailability
                    ? "bg-gray-400 cursor-not-allowed"
                    : cartItems.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600"
                } transition-all duration-300 shadow-md flex items-center justify-center gap-2`}
              >
                {isLoading
                  ? "Processing..."
                  : !actualAvailability
                  ? "Not Available"
                  : cartItems.length === 0
                  ? "Add items to reserve"
                  : "Reserve Table & Order"}
              </button>
            </div>
          </div>
        </motion.div>
      </Card>
    </>
  );
};

export default RestaurantProfileCardById;
