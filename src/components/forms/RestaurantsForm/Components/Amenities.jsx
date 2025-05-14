import React from "react";

const amenitiesList = [
  "WiFi",
  "Air Conditioning",
  "Wheelchair Accessible",
  "Outdoor Seating",
  "Parking",
  "Bar",
  "Live Music",
  "TV",
  "Private Dining",
  "Pet Friendly",
  "Accepts Card, Apple Pay, Cash",
];

const Amenities = ({ register }) => {
  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Amenities</h2>
        <p className="text-sm text-gray-500 mt-2">
          Select the amenities your restaurant offers to help customers find
          you.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {amenitiesList.map((amenity) => (
          <div
            key={amenity}
            className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-rose-300 transition-colors"
          >
            <input
              id={`amenity-${amenity}`}
              type="checkbox"
              value={amenity}
              {...register("amenities")}
              className="h-5 w-5 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
            />
            <label
              htmlFor={`amenity-${amenity}`}
              className="ml-3 block text-sm font-medium text-gray-700"
            >
              {amenity}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Amenities;
