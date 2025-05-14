import React from "react";
import {
  IoBedOutline,
  IoPeopleOutline,
  IoPricetagOutline,
  IoTextOutline,
} from "react-icons/io5";

const BasicInformation = ({ register, errors }) => {
  const roomTypes = [
    { value: "single", label: "Single" },
    { value: "double", label: "Double" },
    { value: "twin", label: "Twin" },
    { value: "triple", label: "Triple" },
    { value: "queen", label: "Queen" },
    { value: "king", label: "King" },
    { value: "family", label: "Family" },
    { value: "suite", label: "Suite" },
    { value: "presidential", label: "Presidential" },
    { value: "dormitory", label: "Dormitory" },
    { value: "cottage", label: "Cottage" },
    { value: "tent", label: "Tent" },
    { value: "penthouse", label: "Penthouse" },
    { value: "honeymoon", label: "Honeymoon" },
    { value: "studio", label: "Studio" },
    { value: "shared", label: "Shared" },
    { value: "private", label: "Private" },
    { value: "entire_home", label: "Entire Home" },
    { value: "other", label: "Other" },
  ];

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Basic Information
      </h2>

      <div className="space-y-6">
        {/* Room Name Field */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Room Name *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IoTextOutline className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="name"
              {...register("name", { required: "Room name is required" })}
              className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-rose-500 focus:border-rose-500 sm:text-sm ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Deluxe King Suite"
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Room Type Field */}
        <div>
          <label
            htmlFor="roomType"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Room Type *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IoBedOutline className="h-5 w-5 text-gray-400" />
            </div>
            <select
              id="roomType"
              {...register("roomType", { required: "Room type is required" })}
              className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-rose-500 focus:border-rose-500 sm:text-sm ${
                errors.roomType ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select a room type</option>
              {roomTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          {errors.roomType && (
            <p className="mt-1 text-sm text-red-600">
              {errors.roomType.message}
            </p>
          )}
        </div>

        {/* Description Field */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            {...register("description")}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
            placeholder="Describe your room's features, amenities, and unique qualities..."
          />
        </div>

        {/* Price Field */}
        <div>
          <label
            htmlFor="pricePerNight"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Price Per Night *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IoPricetagOutline className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              id="pricePerNight"
              {...register("pricePerNight", {
                required: "Price is required",
                min: { value: 0, message: "Price cannot be negative" },
              })}
              className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-rose-500 focus:border-rose-500 sm:text-sm ${
                errors.pricePerNight ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="0.00"
              step="0.01"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">USD</span>
            </div>
          </div>
          {errors.pricePerNight && (
            <p className="mt-1 text-sm text-red-600">
              {errors.pricePerNight.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BasicInformation;
