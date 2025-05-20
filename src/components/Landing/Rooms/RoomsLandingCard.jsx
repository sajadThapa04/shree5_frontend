import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaWifi,
  FaTv,
  FaSnowflake,
  FaParking,
  FaHome,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { MdKingBed, MdBathtub } from "react-icons/md";
import { Button } from "../../Ui";

const RoomsLandingCard = ({ room, serviceName, onBookNow }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showArrows, setShowArrows] = useState(false);

  const keyAmenityIcons = {
    wifi: <FaWifi className="h-4 w-4" />,
    tv: <FaTv className="h-4 w-4" />,
    air_con: <FaSnowflake className="h-4 w-4" />,
    kitchen: <FaHome className="h-4 w-4" />,
    free_parking: <FaParking className="h-4 w-4" />,
  };

  if (!room) return null;

  const displayedAmenities = room.amenities
    ? room.amenities.filter((amenity) => keyAmenityIcons[amenity]).slice(0, 4)
    : [];

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === room.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? room.images.length - 1 : prevIndex - 1
    );
  };

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
        {room.images && room.images.length > 0 ? (
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
                src={room.images[currentImageIndex]}
                alt={serviceName || room.name}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Carousel Controls - Only show on hover and when multiple images exist */}
            {room.images.length > 1 && showArrows && (
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
              {room.images.map((_, index) => (
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
            <span className="text-gray-500">No Image</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title and Price */}
        <div className="flex justify-between items-start mb-2">
          <motion.h3
            className="text-lg font-semibold text-gray-900 line-clamp-1"
            whileHover={{
              x: 2,
              transition: { duration: 0.2 },
            }}
          >
            <span className="relative">
              {serviceName || room.name}
              <motion.span
                className="absolute bottom-0 left-0 w-full h-0.5 bg-black-600"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                style={{ originX: 0 }}
              />
            </span>
          </motion.h3>

          <motion.div
            className="flex flex-col items-end"
            whileHover={{ y: -1 }}
            transition={{ duration: 0.1 }}
          >
            <span className="text-lg font-bold text-black-600 whitespace-nowrap">
              ${room.pricePerNight}
            </span>
            <span className="text-xs font-normal text-gray-500 -mt-1">
              per night
            </span>
          </motion.div>
        </div>

        {/* Room Type */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-1">
          {room.service?.type}
        </p>

        {/* Key Details */}
        <div className="flex items-center space-x-4 mb-3 text-sm">
          <div className="flex items-center text-gray-600">
            <MdKingBed className="h-4 w-4 mr-1" />
            <span>{room.bedType || "Double"}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <MdBathtub className="h-4 w-4 mr-1" />
            <span>{room.bathroomType || "Private"}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <FaHome className="h-4 w-4 mr-1" />
            <span>{room.size} sq.ft</span>
          </div>
        </div>

        {/* Amenities */}
        {displayedAmenities.length > 0 && (
          <div className="flex items-center space-x-3 mb-4">
            {displayedAmenities.map((amenity) => (
              <motion.div
                key={amenity}
                whileHover={{ scale: 1.2 }}
                className="text-gray-500 hover:text-black-600 transition-colors"
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
            className={`text-xs font-medium px-2 py-1 rounded ${
              room.isAvailable
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {room.isAvailable ? "Available" : "Booked"}
          </motion.span>
          <Button
            onClick={() => onBookNow && onBookNow(room._id)}
            variant="primary"
            size="small"
            disabled={!room.isAvailable}
          >
            {room.isAvailable ? "Book Now" : "Unavailable"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default RoomsLandingCard;
