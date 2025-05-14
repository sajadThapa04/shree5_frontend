import React from "react";

const AmenitiesAndTag = ({ register }) => {
  const amenitiesList = [
    "wifi",
    "tv",
    "air_con",
    "heating",
    "kitchen",
    "washing_machine",
    "dryer",
    "free_parking",
    "pool",
    "hot_tub",
    "gym",
    "breakfast",
    "workspace",
    "fireplace",
    "iron",
    "hair_dryer",
    "essentials",
    "hot_water",
    "elevator",
  ];

  const tagsList = [
    "luxury",
    "budget",
    "family_friendly",
    "pet_friendly",
    "romantic",
    "business",
    "accessible",
    "beachfront",
    "downtown",
    "mountain_view",
    "countryside",
    "historic",
    "modern",
    "cozy",
    "spacious",
    "minimalist",
  ];

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Amenities & Tags
      </h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amenities
          </label>
          <div className="flex flex-wrap gap-2">
            {amenitiesList.map((amenity) => (
              <div
                key={`amenity-${amenity}`}
                className="flex items-center p-2 bg-white rounded-lg border border-gray-200 hover:border-rose-300 transition-colors"
              >
                <input
                  id={`amenity-${amenity}`}
                  type="checkbox"
                  value={amenity}
                  {...register("amenities")}
                  className="h-4 w-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                />
                <label
                  htmlFor={`amenity-${amenity}`}
                  className="ml-2 block text-sm font-medium text-gray-700"
                >
                  {amenity.replace(/_/g, " ")}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {tagsList.map((tag) => (
              <div
                key={`tag-${tag}`}
                className="flex items-center p-2 bg-white rounded-lg border border-gray-200 hover:border-rose-300 transition-colors"
              >
                <input
                  id={`tag-${tag}`}
                  type="checkbox"
                  value={tag}
                  {...register("tags")}
                  className="h-4 w-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                />
                <label
                  htmlFor={`tag-${tag}`}
                  className="ml-2 block text-sm font-medium text-gray-700"
                >
                  {tag.replace(/_/g, " ")}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmenitiesAndTag;
