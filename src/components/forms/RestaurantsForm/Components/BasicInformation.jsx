import React from "react";
import CuisineDetailsField from "./CuisineDetailsField";

const BasicInformation = ({ register, errors, control, watch, setValue }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Restaurant Details
        </h2>

        <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">
              Dish Name / Menu Items *
            </label>
            <p className="text-sm text-gray-500 mb-4">
              Add your restaurant's menu items with names, prices, and images
            </p>
            <CuisineDetailsField
              register={register}
              control={control}
              errors={errors}
              watch={watch}
              setValue={setValue}
            />
          </div>

          <div className="pt-4 border-t border-gray-100">
            <label
              htmlFor="seatingCapacity"
              className="block text-base font-medium text-gray-700 mb-2"
            >
              Seating Capacity *
            </label>
            <p className="text-sm text-gray-500 mb-4">
              How many customers can your restaurant accommodate at once?
            </p>
            <input
              placeholder="please enter number"
              id="seatingCapacity"
              type="number"
              min="1"
              {...register("seatingCapacity", {
                required: "Seating capacity is required",
                min: {
                  value: 1,
                  message: "Capacity must be at least 1",
                },
              })}
              className={`mt-1 block w-full px-4 py-3 text-base rounded-lg border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 ${
                errors.seatingCapacity ? "border-red-500" : "border"
              }`}
            />
            {errors.seatingCapacity && (
              <p className="mt-2 text-sm text-red-600">
                {errors.seatingCapacity.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInformation;
