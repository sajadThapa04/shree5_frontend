import React from "react";
import { FaUtensils } from "react-icons/fa";

const ServiceNameCard = ({ serviceName, images, onImageClick }) => {
  return (
    <div className="space-y-4">
      <div
        className="relative h-64 rounded-xl overflow-hidden bg-gradient-to-br from-red-50 to-amber-50 cursor-pointer"
        onClick={() => images[0] && onImageClick(images[0])}
      >
        {images[0] ? (
          <img
            src={images[0]}
            alt={serviceName}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full flex items-center justify-center">
            <FaUtensils className="h-20 w-20 text-red-400" />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
          <h2 className="text-2xl font-bold text-white">{serviceName}</h2>
          <p className="text-white/90 capitalize">Restaurant</p>
        </div>
      </div>

      {images.length > 1 && (
        <div className="w-full overflow-x-auto pb-2">
          <div className="flex space-x-2">
            {images.slice(1).map((img, index) => (
              <div
                key={index}
                className="flex-none w-32 h-32 rounded-lg overflow-hidden cursor-pointer"
                onClick={() => onImageClick(img)}
              >
                <img
                  src={img}
                  alt={`${serviceName} ${index + 2}`}
                  className="h-full w-full object-cover"
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