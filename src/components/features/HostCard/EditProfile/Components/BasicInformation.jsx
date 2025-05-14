import React from "react";
import { useFormContext } from "react-hook-form";

function BasicInformation() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
        <p className="text-gray-500 mt-2">
          Provide essential details about your hosting service
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Host Name
            <span className="text-rose-600"> *</span>
          </label>
          <input
            id="name"
            {...register("name", { required: "Host name is required" })}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-rose-500 ${
              errors.name
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300"
            } transition duration-200`}
            placeholder="Enter your business or host name"
          />
          {errors.name && (
            <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Description
            <span className="text-rose-600"> *</span>
          </label>
          <textarea
            id="description"
            {...register("description", {
              required: "Description is required",
              maxLength: {
                value: 4000,
                message: "Description should not exceed 4000 characters",
              },
            })}
            rows={4}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-rose-500 ${
              errors.description
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300"
            } transition duration-200 resize-none`}
            placeholder="Describe your hosting service (max 500 characters)"
          />
          {errors.description && (
            <p className="mt-2 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default BasicInformation;
