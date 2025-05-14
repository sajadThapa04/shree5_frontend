import React from "react";
import { motion } from "framer-motion";
import { FaBed, FaStar } from "react-icons/fa";

const ServiceNameCard = ({
  serviceName,
  images = [],
  accommodationImages = [],
  onImageClick,
}) => {
  const [activeTab, setActiveTab] = React.useState("room");

  const displayedImages = activeTab === "room" ? images : accommodationImages;

  return (
    <div className="space-y-4">
      {/* Image Gallery Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === "room"
              ? "text-rose-600 border-b-2 border-rose-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("room")}
        >
          Room Images ({images.length})
        </button>
        {accommodationImages.length > 0 && (
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "property"
                ? "text-rose-600 border-b-2 border-rose-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("property")}
          >
            Property Images ({accommodationImages.length})
          </button>
        )}
      </div>

      {/* Main Image (First image as featured) */}
      {displayedImages.length > 0 ? (
        <div className="relative h-64 w-full rounded-xl overflow-hidden bg-gray-100">
          <motion.img
            whileHover={{ scale: 1.05 }}
            src={displayedImages[0]}
            alt={serviceName}
            className="h-full w-full object-cover cursor-pointer"
            onClick={() => onImageClick(displayedImages[0])}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <h2 className="text-xl font-bold text-white">{serviceName}</h2>
            <div className="flex items-center mt-1">
              <FaStar className="h-4 w-4 text-yellow-400" />
              <span className="ml-1 text-sm text-white">4.8 (120 reviews)</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-64 w-full rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
          <FaBed className="h-12 w-12" />
        </div>
      )}

      {/* All Images Horizontal Scroll (excluding first image) */}
      {displayedImages.length > 1 && (
        <div className="w-full overflow-x-auto pb-2">
          <div className="flex space-x-2">
            {displayedImages.slice(1).map((image, index) => (
              <div
                key={index}
                className="flex-none w-32 h-32 rounded-lg overflow-hidden bg-gray-100 cursor-pointer"
                onClick={() => onImageClick(image)}
              >
                <img
                  src={image}
                  alt={`${serviceName} view ${index + 2}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceNameCard;
