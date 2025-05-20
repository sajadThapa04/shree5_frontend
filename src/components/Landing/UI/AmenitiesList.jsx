import React from "react";

const AmenitiesList = ({ amenities, icons }) => {
  if (!amenities || amenities.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {amenities.map((amenity, index) => (
        <div key={index} className="flex items-center">
          {icons[amenity] || <span className="h-5 w-5 mr-2">•</span>}
          <span className="text-gray-600 capitalize ml-2">
            {amenity.replace(/_/g, " ")}
          </span>
        </div>
      ))}
    </div>
  );
};

export default AmenitiesList;
