import React from "react";
import { GiPartyPopper } from "react-icons/gi";
import {
  FaWifi,
  FaCheckCircle,
  FaSnowflake,
  FaParking,
  FaWheelchair,
  FaCreditCard,
  FaTv,
  FaDoorClosed,
  FaMoneyBillWave,
} from "react-icons/fa";
import { MdLocalBar } from "react-icons/md";
import { BsApple } from "react-icons/bs";

const amenityIcons = {
  wifi: <FaWifi className="text-blue-500" title="WiFi" />,
  "air conditioning": (
    <FaSnowflake className="text-blue-400" title="Air Conditioning" />
  ),
  parking: <FaParking className="text-green-500" title="Parking" />,
  "wheelchair accessible": (
    <FaWheelchair className="text-purple-500" title="Wheelchair Accessible" />
  ),
  "accepts card": (
    <FaCreditCard className="text-gray-600" title="Accepts Cards" />
  ),
  "apple pay": <BsApple className="text-gray-800" title="Apple Pay" />,
  cash: <FaMoneyBillWave className="text-green-600" title="Cash" />,
  bar: <MdLocalBar className="text-amber-600" title="Bar" />,
  tv: <FaTv className="text-blue-600" title="TV" />,
  "private dining": (
    <FaDoorClosed className="text-gray-700" title="Private Dining" />
  ),
};

const Ameneties = ({ amenities }) => {
  if (!amenities || amenities.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
        Amenities
      </h3>
      <div className="flex flex-wrap gap-3">
        {amenities.map((amenity, index) => (
          <div
            key={index}
            className="flex items-center bg-gray-50 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors"
            title={amenity}
          >
            <span className="mr-2">
              {amenityIcons[amenity] || (
                <FaCheckCircle className="text-gray-500" />
              )}
            </span>
            <span className="text-sm font-medium text-gray-700 capitalize">
              {amenity}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ameneties;
