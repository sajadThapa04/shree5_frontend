import React from "react";
import {
  BuildingStorefrontIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  ShieldCheckIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { Card } from "../../Ui";
import { motion } from "framer-motion";

const HostProfileCard = ({ host, onCreate, isLoading }) => {
  if (!host) {
    return (
      <div className="text-center p-4 text-gray-500">
        No host data available
      </div>
    );
  }

  const {
    name = "New Host",
    listingType = "property",
    phone = "Not provided",
    email = "Not provided",
    address = {},
    status = "pending",
    isFeatured = false,
  } = host;

  // Status configuration
  const statusConfig = {
    active: { color: "bg-green-100 text-green-800", icon: ShieldCheckIcon },
    pending: { color: "bg-amber-100 text-amber-800", icon: ClockIcon },
    rejected: { color: "bg-red-100 text-red-800", icon: ShieldCheckIcon },
  };

  const StatusIcon = statusConfig[status]?.icon || ClockIcon;
  const statusColor =
    statusConfig[status]?.color || "bg-gray-100 text-gray-800";

  return (
    <Card className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="flex flex-col md:flex-row gap-6"
      >
        {/* Host Image/Icon */}
        <div className="flex-shrink-0 flex items-center justify-center">
          <div className="h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center">
            <BuildingStorefrontIcon className="h-12 w-12 text-indigo-600" />
          </div>
        </div>

        {/* Host Details */}
        <div className="flex-1 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{name}</h2>
              <p className="text-gray-500 capitalize">
                {listingType.replace("_", " ")}
              </p>
            </div>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}
            >
              <StatusIcon className="h-4 w-4 mr-1" />
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>

          {/* Contact Info */}
          <div className="space-y-2">
            <div className="flex items-center">
              <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3" />
              <p className="text-sm text-gray-700">{email}</p>
            </div>
            <div className="flex items-center">
              <PhoneIcon className="h-5 w-5 text-gray-400 mr-3" />
              <p className="text-sm text-gray-700">{phone}</p>
            </div>
            {address && (
              <div className="flex items-center">
                <MapPinIcon className="h-5 w-5 text-gray-400 mr-3" />
                <p className="text-sm text-gray-700">
                  {address.city}, {address.country}
                </p>
              </div>
            )}
          </div>

          {/* Action Button */}
          {onCreate && (
            <button
              onClick={() => onCreate(host)}
              disabled={isLoading}
              className={`mt-4 w-full md:w-auto px-4 py-2 rounded-md text-sm font-medium text-white ${
                isLoading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {isLoading ? "Creating..." : "Create Host Profile"}
            </button>
          )}
        </div>
      </motion.div>
    </Card>
  );
};

export default HostProfileCard;
