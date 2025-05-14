import React from "react";
import { Card } from "../../Ui";
import { motion } from "framer-motion";
import { 
  FaUtensils, 
  FaClock, 
  FaCheckCircle, 
  FaTimesCircle,
  FaWifi,
  FaSnowflake,
  FaParking,
  FaWheelchair,
  FaCreditCard
} from "react-icons/fa";
import { MdLocationOn, MdRestaurantMenu } from "react-icons/md";
import { GiMeal } from "react-icons/gi";

const RestaurantsProfileCard = ({ restaurant, onCreate, isLoading }) => {
  if (!restaurant) {
    return (
      <div className="text-center p-4 text-gray-500">
        No restaurant data available
      </div>
    );
  }

  const {
    serviceName,
    cuisineDetails = [],
    seatingCapacity,
    amenities = [],
    openingHours = [],
    images = [],
    isAvailable
  } = restaurant;

  // Amenity icons mapping
  const amenityIcons = {
    wifi: <FaWifi className="text-blue-500" />,
    ac: <FaSnowflake className="text-blue-400" />,
    parking: <FaParking className="text-green-500" />,
    wheelchair: <FaWheelchair className="text-purple-500" />,
    card: <FaCreditCard className="text-gray-600" />
  };

  // Availability configuration
  const availabilityConfig = {
    true: {
      color: "bg-green-100 text-green-800",
      icon: FaCheckCircle,
      text: "Open Now"
    },
    false: {
      color: "bg-red-100 text-red-800",
      icon: FaTimesCircle,
      text: "Closed"
    }
  };

  const AvailabilityIcon = availabilityConfig[isAvailable]?.icon || FaTimesCircle;
  const availabilityColor = availabilityConfig[isAvailable]?.color || "bg-red-100 text-red-800";
  const availabilityText = availabilityConfig[isAvailable]?.text || "Closed";

  // Get current day's opening hours
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = days[new Date().getDay()];
  const todayHours = openingHours.find(day => day.day === today)?.timeSlots[0] || null;

  return (
    <Card className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        className="flex flex-col md:flex-row gap-6"
      >
        {/* Restaurant Image/Icon */}
        <div className="flex-shrink-0 flex items-center justify-center">
          <div className="h-48 w-48 rounded-lg bg-red-50 flex items-center justify-center overflow-hidden">
            {images[0] ? (
              <img 
                src={images[0]} 
                alt={serviceName} 
                className="h-full w-full object-cover"
              />
            ) : (
              <FaUtensils className="h-16 w-16 text-red-500" />
            )}
          </div>
        </div>

        {/* Restaurant Details */}
        <div className="flex-1 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{serviceName}</h2>
              <p className="text-gray-500 capitalize">Restaurant</p>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${availabilityColor}`}
              >
                <AvailabilityIcon className="h-4 w-4 mr-1" />
                {availabilityText}
              </span>
              {todayHours && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <FaClock className="h-4 w-4 mr-1" />
                  {todayHours.openingTime} - {todayHours.closingTime}
                </span>
              )}
            </div>
          </div>

          {/* Capacity and Cuisine */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <GiMeal className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm font-medium text-gray-700">
                {cuisineDetails.length} Menu Items
              </span>
            </div>
            <div className="flex items-center">
              <MdRestaurantMenu className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm font-medium text-gray-700">
                Seats: {seatingCapacity}
              </span>
            </div>
          </div>

          {/* Top 3 Cuisine Items */}
          {cuisineDetails.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-500 uppercase">Popular Items</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {cuisineDetails.slice(0, 3).map((item, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-medium text-gray-900 capitalize">{item.name}</p>
                    <p className="text-sm text-rose-600">${item.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Amenities */}
          {amenities.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-500 uppercase">Amenities</p>
              <div className="flex flex-wrap gap-2">
                {amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center bg-gray-50 px-3 py-1 rounded-full">
                    {amenityIcons[amenity] || <FaCheckCircle className="text-gray-500" />}
                    <span className="ml-1 text-sm font-medium text-gray-700 capitalize">
                      {amenity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          {onCreate && (
            <button
              onClick={() => onCreate(restaurant)}
              disabled={isLoading}
              className={`mt-4 w-full md:w-auto px-4 py-2 rounded-md text-sm font-medium text-white ${
                isLoading ? "bg-gray-400" : "bg-rose-600 hover:bg-rose-700"
              } transition-colors duration-300`}
            >
              {isLoading ? "Processing..." : "View Menu"}
            </button>
          )}
        </div>
      </motion.div>
    </Card>
  );
};

export default RestaurantsProfileCard;