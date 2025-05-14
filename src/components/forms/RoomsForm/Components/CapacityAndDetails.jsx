import React from "react";
import {
  IoPeopleOutline,
  IoResizeOutline,
  IoBusinessOutline,
  IoBedOutline,
  IoWaterOutline
} from "react-icons/io5";

import { FaChildren } from "react-icons/fa6";

const CapacityAndDetails = ({ register, errors }) => {
  const bedTypes = [
    { value: "king", label: "King Bed" },
    { value: "queen", label: "Queen Bed" },
    { value: "double", label: "Double Bed" },
    { value: "single", label: "Single Bed" },
    { value: "bunk", label: "Bunk Bed" },
    { value: "floor_mattress", label: "Floor Mattress" },
    { value: "other", label: "Other" }
  ];

  const bathroomTypes = [
    { value: "shared", label: "Shared Bathroom" },
    { value: "private", label: "Private Bathroom" },
    { value: "ensuite", label: "Ensuite Bathroom" }
  ];

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Capacity & Details</h2>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {/* Adults Capacity */}
        <div>
          <label htmlFor="adults" className="block text-sm font-medium text-gray-700 mb-1">
            Adults *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IoPeopleOutline className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              id="adults"
              {...register("capacity.adults", { 
                required: "Adult capacity is required",
                min: { value: 1, message: "Must accommodate at least 1 adult" }
              })}
              className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-rose-500 focus:border-rose-500 sm:text-sm ${
                errors.capacity?.adults ? "border-red-500" : "border-gray-300"
              }`}
              min="1"
              placeholder="2"
            />
          </div>
          {errors.capacity?.adults && (
            <p className="mt-1 text-sm text-red-600">{errors.capacity.adults.message}</p>
          )}
        </div>

        {/* Children Capacity */}
        <div>
          <label htmlFor="children" className="block text-sm font-medium text-gray-700 mb-1">
            Children
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaChildren className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              id="children"
              {...register("capacity.children", { 
                min: { value: 0, message: "Cannot be negative" }
              })}
              className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-rose-500 focus:border-rose-500 sm:text-sm ${
                errors.capacity?.children ? "border-red-500" : "border-gray-300"
              }`}
              min="0"
              placeholder="0"
            />
          </div>
          {errors.capacity?.children && (
            <p className="mt-1 text-sm text-red-600">{errors.capacity.children.message}</p>
          )}
        </div>

        {/* Room Size */}
        <div>
          <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">
            Size (sq ft)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IoResizeOutline className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              id="size"
              {...register("size", { 
                min: { value: 0, message: "Cannot be negative" }
              })}
              className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-rose-500 focus:border-rose-500 sm:text-sm ${
                errors.size ? "border-red-500" : "border-gray-300"
              }`}
              min="0"
              placeholder="350"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 text-sm">sq ft</span>
            </div>
          </div>
          {errors.size && (
            <p className="mt-1 text-sm text-red-600">{errors.size.message}</p>
          )}
        </div>

        {/* Floor Number */}
        <div>
          <label htmlFor="floorNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Floor Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IoBusinessOutline className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              id="floorNumber"
              {...register("floorNumber", { 
                min: { value: 0, message: "Cannot be negative" }
              })}
              className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-rose-500 focus:border-rose-500 sm:text-sm ${
                errors.floorNumber ? "border-red-500" : "border-gray-300"
              }`}
              min="0"
              placeholder="1"
            />
          </div>
          {errors.floorNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.floorNumber.message}</p>
          )}
        </div>

        {/* Bed Type */}
        <div>
          <label htmlFor="bedType" className="block text-sm font-medium text-gray-700 mb-1">
            Bed Type
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IoBedOutline className="h-5 w-5 text-gray-400" />
            </div>
            <select
              id="bedType"
              {...register("bedType")}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
            >
              <option value="">Select bed type</option>
              {bedTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bathroom Type */}
        <div>
          <label htmlFor="bathroomType" className="block text-sm font-medium text-gray-700 mb-1">
            Bathroom Type
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IoWaterOutline className="h-5 w-5 text-gray-400" />
            </div>
            <select
              id="bathroomType"
              {...register("bathroomType")}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
            >
              <option value="">Select bathroom type</option>
              {bathroomTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CapacityAndDetails;