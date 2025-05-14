// components/Profile/ImagePreview.jsx
import { useEffect, useState } from "react";
import { UserIcon } from "@heroicons/react/24/outline";

const ImagePreview = ({
  previewUrl,
  user,
  size = "lg",
  isUploading = false,
}) => {
  const sizes = {
    sm: "h-8 w-8 text-sm",        // Matches navbar user icon size
    md: "h-10 w-10 text-base",    // Matches mobile menu user icon size
    lg: "h-32 w-32 text-3xl",     // For larger profile displays
  };

  const [displayUrl, setDisplayUrl] = useState(user?.profileImage);
  const [hasError, setHasError] = useState(false);

  const getInitial = () => {
    if (user?.fullName) return user.fullName.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return "?";
  };

  // Update display URL when preview changes or upload completes
  useEffect(() => {
    if (previewUrl) {
      setDisplayUrl(previewUrl);
      setHasError(false);
    } else if (!isUploading) {
      setDisplayUrl(user?.profileImage);
      setHasError(false);
    }
  }, [previewUrl, user?.profileImage, isUploading]);

  // If loading state or error
  if (hasError || !displayUrl) {
    return (
      <div className={`relative rounded-full ${sizes[size]} flex items-center justify-center bg-rose-100 text-rose-600`}>
        {isUploading ? (
          <div className="animate-pulse">
            <UserIcon className={`${sizes[size].split(' ')[0]} text-rose-300`} />
          </div>
        ) : (
          <span className={`font-medium ${sizes[size].includes('text-') ? '' : 'text-lg'}`}>
            {getInitial()}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${sizes[size]}`}>
      <img
        src={displayUrl}
        alt="Profile preview"
        className={`rounded-full object-cover ${sizes[size]} ${
          size === "sm" 
            ? "" 
            : "border-4 border-white dark:border-gray-800"
        }`}
        onError={() => setHasError(true)}
      />
      {isUploading && (
        <div className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      )}
    </div>
  );
};

export default ImagePreview;