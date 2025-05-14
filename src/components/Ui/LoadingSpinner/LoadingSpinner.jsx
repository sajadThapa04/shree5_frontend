import React from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

function LoadingSpinner({ size = "md", text = "Loading..." }) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <ArrowPathIcon
        className={`${sizeClasses[size]} text-rose-600 animate-spin`}
        aria-hidden="true"
      />
      <p className={`${textSizes[size]} text-gray-600 font-medium`}>{text}</p>
    </div>
  );
}

export default LoadingSpinner;
