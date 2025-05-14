import React, { useState, useEffect } from "react";
import { PhotoIcon, TrashIcon } from "@heroicons/react/24/outline";

const RoomImages = ({ roomImages, setRoomImages }) => {
  const [images, setImages] = useState([]);

  // Sync with parent component
  useEffect(() => {
    setRoomImages(images);
  }, [images, setRoomImages]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 10) {
      alert("You can upload a maximum of 10 images");
      return;
    }

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      type: file.type
    }));

    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    const updated = [...images];
    URL.revokeObjectURL(updated[index].preview);
    updated.splice(index, 1);
    setImages(updated);
  };

  // Clean up object URLs
  useEffect(() => {
    return () => {
      images.forEach(image => URL.revokeObjectURL(image.preview));
    };
  }, [images]);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Room Images</h2>

      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group h-40">
              <img
                src={image.preview}
                alt={`Room preview ${index}`}
                className="h-full w-full object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-red-500 rounded-full p-1.5 text-white shadow-md hover:bg-red-600 transition-all"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
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
    </div>
  );
};

export default RoomImages;