import React, { useState } from "react";
import { PhotoIcon, TrashIcon } from "@heroicons/react/24/outline";

const RestaurantImage = ({ register, setValue, watch }) => {
  const [images, setImages] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 10) {
      alert("You can upload a maximum of 10 images");
      return;
    }

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages([...images, ...newImages]);
    setValue("images", [...images, ...newImages]);
  };

  const removeImage = (index) => {
    const updated = [...images];
    URL.revokeObjectURL(updated[index].preview);
    updated.splice(index, 1);
    setImages(updated);
    setValue("images", updated);
  };

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Restaurant Images
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          Upload high-quality images that showcase your restaurant (max 10). The
          first image will be used as the main cover photo.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative group h-40">
            <img
              src={image.preview}
              alt={`Restaurant preview ${index}`}
              className="h-full w-full object-cover rounded-lg border border-gray-200"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-red-500 rounded-full p-1.5 text-white shadow-md hover:bg-red-600 transition-all"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
            {index === 0 && (
              <span className="absolute bottom-2 left-2 bg-rose-600 text-white text-xs px-2 py-1 rounded">
                Cover Photo
              </span>
            )}
          </div>
        ))}

        {images.length < 10 && (
          <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-rose-500 hover:bg-rose-50 transition-colors">
            <div className="flex flex-col items-center justify-center p-4 text-center">
              <PhotoIcon className="h-10 w-10 text-gray-400 mb-3" />
              <p className="text-sm text-gray-600">Click to upload</p>
              <p className="text-xs text-gray-400 mt-1">
                {10 - images.length} remaining
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        )}
      </div>
    </div>
  );
};

export default RestaurantImage;
