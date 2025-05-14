import React, { useState, useCallback, useEffect } from "react";
import { CameraIcon } from "@heroicons/react/24/outline";
import heic2any from "heic2any";
import { useSelector } from "react-redux";

const FileUploader = ({
  initialImage = "",
  onUpload,
  maxSizeMB = 15,
  allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/heic",
    "image/heif",
    "image/webp",
  ],
}) => {
  const [preview, setPreview] = useState(initialImage);
  const [error, setError] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  // Get user data from Redux store
  const { userInfo } = useSelector((state) => state.user);

  console.log("User Info:", userInfo);
  console.log("User Full Name:", userInfo?.fullName); // Function to get user initials

  // Function to get user initials
  const getInitials = useCallback(() => {
    if (!userInfo?.fullName) return "?"; // Fallback if no fullName

    // Trim whitespace and ensure proper formatting
    const name = userInfo.fullName.trim().replace(/\s+/g, " ");

    // Return the first letter of the full name, ensuring it's uppercase
    return name.charAt(0).toUpperCase();
  }, [userInfo?.fullName]);

  // Log initials when userInfo changes
  useEffect(() => {
    console.log("User Full Name:", userInfo?.fullName);
    console.log("Initials:", getInitials());
  }, [userInfo]); // This will run every time userInfo changes

  const handleFileChange = useCallback(
    async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (
        !allowedTypes.includes(file.type) &&
        !file.name.toLowerCase().endsWith(".heic") &&
        !file.name.toLowerCase().endsWith(".heif")
      ) {
        setError(`Only ${allowedTypes.join(", ")} files are allowed`);
        return;
      }

      // Validate file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`File size must be less than ${maxSizeMB}MB`);
        return;
      }

      setError("");

      try {
        let displayFile = file;

        // Convert HEIC/HEIF to JPEG for preview
        if (
          file.type === "image/heic" ||
          file.type === "image/heif" ||
          file.name.toLowerCase().endsWith(".heic") ||
          file.name.toLowerCase().endsWith(".heif")
        ) {
          const output = await heic2any({
            blob: file,
            toType: "image/jpeg",
            quality: 0.9,
          });
          const blob = Array.isArray(output) ? output[0] : output;

          displayFile = new File(
            [blob],
            file.name.replace(/\.[^/.]+$/, ".jpeg"),
            {
              type: "image/jpeg",
              lastModified: new Date().getTime(),
            }
          );
        }

        // Create preview
        const reader = new FileReader();
        reader.onload = () => {
          setPreview(reader.result);
          if (onUpload) onUpload(displayFile);
        };
        reader.readAsDataURL(displayFile);
      } catch (err) {
        console.error("Error converting HEIC/HEIF:", err);
        setError("Failed to process image. Please try a different one.");
      }
    },
    [onUpload, maxSizeMB, allowedTypes]
  );

  const handleRemove = useCallback(
    (e) => {
      e.stopPropagation();
      setPreview("");
      if (onUpload) onUpload(null);
    },
    [onUpload]
  );

  return (
    <div className="space-y-4">
      <label
        htmlFor="profile-upload"
        className={`relative block w-32 h-32 rounded-full border-4 ${
          preview ? "border-rose-100" : "border-gray-200"
        } cursor-pointer overflow-hidden transition-all duration-300 ${
          isHovered ? "ring-4 ring-rose-200" : ""
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt={getInitials()}
              className="w-full h-full object-cover"
              onError={() => {
                setPreview(""); // fallback to initials block
              }}
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-rose-50 transition-colors"
            >
              {/* <XMarkIcon className="h-4 w-4 text-rose-600" /> */}
            </button>
          </>
        ) : (
          <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center text-gray-400">
            {(!initialImage || initialImage === "default-profile.png") &&
            userInfo?.fullName ? (
              <span className="text-3xl font-bold text-gray-600">
                {getInitials()}
              </span>
            ) : (
              <>
                <CameraIcon className="h-8 w-8 mb-2" />
                <span className="text-xs">Upload Photo</span>
              </>
            )}
          </div>
        )}
        <input
          id="profile-upload"
          type="file"
          accept={allowedTypes.join(",")}
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default FileUploader;
