import React, { useState } from "react";
import {
  CurrencyDollarIcon,
  PhotoIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

const CuisineDetailsField = ({
  register,
  control,
  errors,
  watch,
  setValue,
}) => {
  const [cuisines, setCuisines] = useState([
    { name: "", price: "", image: null },
  ]);

  const addCuisine = () => {
    setCuisines([...cuisines, { name: "", price: "", image: null }]);
  };

  const removeCuisine = (index) => {
    if (cuisines.length > 1) {
      const updated = [...cuisines];
      if (updated[index].image?.preview) {
        URL.revokeObjectURL(updated[index].image.preview);
      }
      updated.splice(index, 1);
      setCuisines(updated);
    }
  };

  // In the handleImageChange function:
  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const newCuisines = [...cuisines];
    if (newCuisines[index].image?.preview) {
      URL.revokeObjectURL(newCuisines[index].image.preview);
    }

    newCuisines[index].image = {
      file, // The actual File object
      preview: URL.createObjectURL(file), // For preview only
    };

    setCuisines(newCuisines);
    // Update form value with just the file object
    setValue(`cuisineDetails.${index}.image`, file);
  };
  // In the removeImage function:
  const removeImage = (index) => {
    const newCuisines = [...cuisines];
    if (newCuisines[index].image?.preview) {
      URL.revokeObjectURL(newCuisines[index].image.preview);
    }
    newCuisines[index].image = null;
    setCuisines(newCuisines);
    setValue(`cuisineDetails.${index}.image`, null);
  };

  return (
    <div className="mt-4 space-y-6">
      {cuisines.map((cuisine, index) => (
        <div key={index} className="bg-gray-50 p-5 rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dish Name *
              </label>
              <input
                type="text"
                {...register(`cuisineDetails.${index}.name`, {
                  required: "Dish name is required",
                  minLength: {
                    value: 2,
                    message: "Dish name must be at least 2 characters",
                  },
                })}
                placeholder="e.g. Margherita Pizza"
                className={`block w-full px-4 py-3 text-base rounded-lg border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 ${
                  errors.cuisineDetails?.[index]?.name
                    ? "border-red-500"
                    : "border"
                }`}
              />
              {errors.cuisineDetails?.[index]?.name && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.cuisineDetails[index].name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price *
              </label>
              <div className="relative rounded-lg">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register(`cuisineDetails.${index}.price`, {
                    required: "Price is required",
                    min: {
                      value: 0,
                      message: "Price must be positive",
                    },
                  })}
                  className={`block w-full px-4 py-3 pl-10 text-base rounded-lg border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 ${
                    errors.cuisineDetails?.[index]?.price
                      ? "border-red-500"
                      : "border"
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.cuisineDetails?.[index]?.price && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.cuisineDetails[index].price.message}
                </p>
              )}
            </div>
          </div>

          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dish Image
            </label>
            {cuisine.image ? (
              <div className="relative w-40 h-40">
                <img
                  src={cuisine.image.preview}
                  alt={`Dish preview ${index}`}
                  className="w-full h-full object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white shadow-md hover:bg-red-600 transition-colors"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full max-w-xs h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-rose-500 hover:bg-rose-50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <PhotoIcon className="h-10 w-10 text-gray-400 mb-3" />
                  <p className="text-sm text-gray-500">
                    Click to upload dish image
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    JPEG, PNG (Max 5MB)
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, index)}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {cuisines.length > 1 && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => removeCuisine(index)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
              >
                <TrashIcon className="h-4 w-4 mr-1" />
                Remove Dish
              </button>
            </div>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={addCuisine}
        className="mt-4 inline-flex items-center px-4 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-all"
      >
        <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
        Add Another Dish
      </button>
    </div>
  );
};

export default CuisineDetailsField;
