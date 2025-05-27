import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaChevronLeft, FaChevronRight, FaStar } from "react-icons/fa";

const ImageGallery = ({ images, name, onImageClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images?.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? images?.length - 1 : prev - 1
    );
  };

  if (!images || images.length === 0) {
    return (
      <div
        className="relative w-full rounded-xl overflow-hidden bg-gray-200"
        style={{ aspectRatio: "4/3" }}
      >
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          No images available
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div
        className="relative w-full rounded-xl overflow-hidden bg-gray-100"
        style={{ aspectRatio: "4/3" }}
      >
        <img
          src={images[currentImageIndex]}
          alt={name}
          className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => onImageClick(images[currentImageIndex])}
          loading="lazy"
        />
        {/* Image Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h2 className="text-xl font-bold text-white">{name}</h2>
          <div className="flex items-center mt-1">
            <FaStar className="h-4 w-4 text-yellow-400" />
            <span className="ml-1 text-sm text-white">4.8 (120 reviews)</span>
          </div>
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevImage();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 text-gray-800 p-2 rounded-full shadow hover:bg-white transition-colors"
              aria-label="Previous image"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNextImage();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 text-gray-800 p-2 rounded-full shadow hover:bg-white transition-colors"
              aria-label="Next image"
            >
              <FaChevronRight />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 px-1">
          {images.map((img, index) => (
            <div
              key={index}
              className={`flex-shrink-0 h-16 w-16 sm:h-20 sm:w-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                index === currentImageIndex
                  ? "border-rose-500"
                  : "border-transparent hover:border-gray-300"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIndex(index);
              }}
            >
              <img
                src={img}
                alt={`${name} ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
