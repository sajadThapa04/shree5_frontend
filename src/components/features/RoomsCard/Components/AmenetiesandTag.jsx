import React, { useState } from "react";
import {
  FaWifi,
  FaTv,
  FaSnowflake,
  FaFire,
  FaParking,
  FaSwimmingPool,
  FaHotTub,
  FaDumbbell,
  FaCoffee,
  FaLaptop,
  FaFireAlt,
  FaWind,
  FaShower,
} from "react-icons/fa";
import { MdElevator } from "react-icons/md";
import { GiMeal, GiWashingMachine } from "react-icons/gi";
import { MdKitchen, MdLocalLaundryService, MdIron } from "react-icons/md";
import { BiWater } from "react-icons/bi";
import { IoMdWater } from "react-icons/io";

const amenityIcons = {
  wifi: <FaWifi className="text-blue-500" />,
  tv: <FaTv className="text-indigo-500" />,
  air_con: <FaSnowflake className="text-sky-500" />,
  heating: <FaFire className="text-amber-500" />,
  kitchen: <MdKitchen className="text-emerald-500" />,
  washing_machine: <GiWashingMachine className="text-cyan-500" />,
  dryer: <MdLocalLaundryService className="text-blue-400" />,
  free_parking: <FaParking className="text-green-500" />,
  pool: <FaSwimmingPool className="text-teal-500" />,
  hot_tub: <FaHotTub className="text-pink-500" />,
  gym: <FaDumbbell className="text-purple-500" />,
  breakfast: <GiMeal className="text-yellow-500" />,
  workspace: <FaLaptop className="text-gray-600" />,
  fireplace: <FaFireAlt className="text-orange-500" />,
  iron: <MdIron className="text-gray-500" />,
  hair_dryer: <FaWind className="text-blue-300" />,
  essentials: <IoMdWater className="text-blue-400" />,
  hot_water: <BiWater className="text-red-400" />,
  elevator: <MdElevator className="text-gray-700" />,
};

const AmenetiesandTag = ({ amenities = [], tags = [] }) => {
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);

  const displayedAmenities = showAllAmenities
    ? amenities
    : amenities.slice(0, 8);
  const displayedTags = showAllTags ? tags : tags.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Amenities Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-800 flex items-center">
          <FaWifi className="text-blue-500 mr-2" />
          Amenities
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {displayedAmenities.map((amenity, index) => (
            <div
              key={index}
              className="flex items-center p-2.5 bg-white rounded-lg border border-gray-100 hover:border-blue-100 transition-colors duration-150"
            >
              <span className="mr-2.5">
                {amenityIcons[amenity] || <FaWifi className="text-gray-400" />}
              </span>
              <span className="text-sm font-normal text-gray-700 capitalize">
                {amenity.replace(/_/g, " ")}
              </span>
            </div>
          ))}
        </div>

        {amenities.length > 8 && (
          <button
            onClick={() => setShowAllAmenities(!showAllAmenities)}
            className="text-sm font-medium text-rose-600 hover:text-blue-800 flex items-center mt-2"
          >
            {showAllAmenities ? (
              <>
                <span>Show less</span>
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              </>
            ) : (
              <>
                <span>Show all amenities ({amenities.length})</span>
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </>
            )}
          </button>
        )}
      </div>

      {/* Tags Section */}
      {tags.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800 flex items-center">
            <svg
              className="w-4 h-4 text-gray-500 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            Tags
          </h3>

          <div className="flex flex-wrap gap-2">
            {displayedTags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-50 text-gray-700 rounded-full text-xs font-medium capitalize border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                {tag.replace(/_/g, " ")}
              </span>
            ))}
          </div>

          {tags.length > 6 && (
            <button
              onClick={() => setShowAllTags(!showAllTags)}
              className="text-sm font-medium text-gray-600 hover:text-gray-800 flex items-center mt-1"
            >
              {showAllTags ? (
                <>
                  <span>Show fewer</span>
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                </>
              ) : (
                <>
                  <span>Show all tags ({tags.length})</span>
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AmenetiesandTag;
