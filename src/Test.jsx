import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { uploadProfileImage } from "./services/users.api";

const ImageUploadForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const uploadMutation = useMutation({
    mutationFn: uploadProfileImage, // Use the function directly
    onSuccess: (data) => {
      toast.success(data.message || "Image uploaded successfully!");
      resetForm();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to upload image");
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Please select an image first");
      return;
    }
    uploadMutation.mutate(selectedFile);
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    document.getElementById("file-input").value = "";
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Upload Profile Image</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* File Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Image
          </label>
          <input
            id="file-input"
            type="file"
            accept="image/jpeg, image/png, image/webp"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
            disabled={uploadMutation.isLoading}
          />
          <p className="mt-1 text-xs text-gray-500">
            JPEG, PNG, or WEBP. Max 15MB.
          </p>
        </div>

        {/* Preview */}
        {previewUrl && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preview
            </label>
            <img
              src={previewUrl}
              alt="Preview"
              className="h-40 w-40 object-cover rounded-md border border-gray-200"
            />
          </div>
        )}

        {/* Upload Button */}
        <button
          type="submit"
          disabled={!selectedFile || uploadMutation.isLoading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium
            ${
              !selectedFile || uploadMutation.isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          {uploadMutation.isLoading ? "Uploading..." : "Upload Image"}
        </button>

        {/* Cancel Button */}
        {selectedFile && (
          <button
            type="button"
            onClick={resetForm}
            disabled={uploadMutation.isLoading}
            className="w-full py-2 px-4 rounded-md text-gray-700 font-medium
              border border-gray-300 hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
      </form>

      {/* Status Message */}
      {uploadMutation.isError && (
        <p className="mt-4 text-sm text-red-600">
          Error: {uploadMutation.error.message}
        </p>
      )}
    </div>
  );
};

export default ImageUploadForm;
