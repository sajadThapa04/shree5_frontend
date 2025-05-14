import React from "react";
import { Card } from "../../Ui";
import { motion } from "framer-motion";
import {
  FaUtensils,
  FaHotel,
  FaStar,
  FaCheckCircle,
  FaShieldAlt,
  FaTimesCircle,
  FaClock,
} from "react-icons/fa";
import { IoIosRestaurant } from "react-icons/io";

import { GiWoodCabin, GiFamilyHouse } from "react-icons/gi";
import { MdOtherHouses, MdLocationOn } from "react-icons/md";

const ServiceProfileCard = ({ service, onCreate, isLoading }) => {
  if (!service) {
    return (
      <>
      <div className="text-center p-4 text-gray-500">
        No service data available
      </div>
      </>

    );
  }

  const {
    name = "New Service",
    type = "restaurant",
    address = {},
    isAvailable = false,
    status = "pending",
  } = service;

  // Service type icons configuration
  const serviceTypeIcons = {
    restaurant: {
      icon: IoIosRestaurant,
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
    },
    hotel: {
      icon: FaHotel,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    lodge: {
      icon: GiWoodCabin,
      bgColor: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    home_stay: {
      icon: GiFamilyHouse,
      bgColor: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    luxury_villa: {
      icon: FaStar,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    other: {
      icon: MdOtherHouses,
      bgColor: "bg-gray-100",
      iconColor: "text-gray-600",
    },
  };

  const ServiceTypeIcon = serviceTypeIcons[type]?.icon || MdOtherHouses;
  const serviceTypeBgColor = serviceTypeIcons[type]?.bgColor || "bg-gray-100";
  const serviceTypeIconColor =
    serviceTypeIcons[type]?.iconColor || "text-gray-600";

  // Status configuration
  const statusConfig = {
    active: {
      color: "bg-green-100 text-green-800",
      icon: FaShieldAlt,
    },
    pending: {
      color: "bg-amber-100 text-amber-800",
      icon: FaClock,
    },
    rejected: {
      color: "bg-red-100 text-red-800",
      icon: FaTimesCircle,
    },
    inactive: {
      color: "bg-gray-100 text-gray-800",
      icon: FaTimesCircle,
    },
  };

  const StatusIcon = statusConfig[status]?.icon || FaClock;
  const statusColor =
    statusConfig[status]?.color || "bg-gray-100 text-gray-800";

  // Availability configuration
  const availabilityConfig = {
    true: {
      color: "bg-green-100 text-green-800",
      icon: FaCheckCircle,
    },
    false: {
      color: "bg-red-100 text-red-800",
      icon: FaTimesCircle,
    },
  };

  const AvailabilityIcon =
    availabilityConfig[isAvailable]?.icon || FaTimesCircle;
  const availabilityColor =
    availabilityConfig[isAvailable]?.color || "bg-red-100 text-red-800";

  return (
    <Card className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        className="flex flex-col md:flex-row gap-6"
      >
        {/* Service Image/Icon */}
        <div className="flex-shrink-0 flex items-center justify-center">
          <div
            className={`h-24 w-24 rounded-full ${serviceTypeBgColor} flex items-center justify-center`}
          >
            <ServiceTypeIcon className={`h-12 w-12 ${serviceTypeIconColor}`} />
          </div>
        </div>

        {/* Service Details */}
        <div className="flex-1 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{name}</h2>
              <p className="text-gray-500 capitalize">
                {type.replace("_", " ")}
              </p>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}
              >
                <StatusIcon className="h-4 w-4 mr-1" />
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${availabilityColor}`}
              >
                <AvailabilityIcon className="h-4 w-4 mr-1" />
                {isAvailable ? "Available" : "Unavailable"}
              </span>
            </div>
          </div>

          {/* Address Info */}
          {address && (
            <div className="space-y-2">
              <div className="flex items-center">
                <MdLocationOn className="h-5 w-5 text-gray-400 mr-3" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-500 uppercase">
                    Location
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {address.street && `${address.street}, `}
                    {address.city}, {address.country}
                    {address.zipCode && `, ${address.zipCode}`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Button */}
          {onCreate && (
            <button
              onClick={() => onCreate(service)}
              disabled={isLoading}
              className={`mt-4 w-full md:w-auto px-4 py-2 rounded-md text-sm font-medium text-white ${
                isLoading ? "bg-gray-400" : "bg-rose-600 hover:bg-rose-700"
              } transition-colors duration-300`}
            >
              {isLoading ? "Processing..." : "View Details"}
            </button>
          )}
        </div>
      </motion.div>
    </Card>
  );
};

export default ServiceProfileCard;
