import React from "react";
import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

const Button = ({
  children,
  variant = "primary",
  size = "medium",
  icon: Icon,
  iconPosition = "right",
  to,
  className = "",
  isLoading = false,
  disabled = false, // Added disabled prop
  ...props
}) => {
  // Base classes
  const baseClasses =
    "rounded-md font-medium transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50 disabled:cursor-not-allowed";

  // Variant classes
  const variantClasses = {
    primary: "bg-rose-600 text-white hover:bg-rose-700 shadow-sm",
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50",
    ghost: "text-gray-700 hover:bg-gray-50 hover:text-rose-500",
    icon: "p-2 text-gray-500 hover:text-rose-500 hover:bg-gray-50 rounded-full",
  };

  // Size classes
  const sizeClasses = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-4 py-2 text-sm",
    large: "px-6 py-3 text-base",
  };

  // Icon size classes
  const iconSizeClasses = {
    small: "h-4 w-4",
    medium: "h-5 w-5",
    large: "h-6 w-6",
  };

  // Combine classes
  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${
    variant !== "icon" ? sizeClasses[size] : ""
  } ${className}`;

  // Loading spinner component
  const loadingSpinner = (
    <svg
      className={`animate-spin ${iconSizeClasses[size]} ${
        children ? "mr-2" : ""
      }`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

  // Icon component
  const iconComponent = Icon && (
    <Icon
      className={`${iconSizeClasses[size]} ${
        iconPosition === "right" ? "ml-2" : "mr-2"
      }`}
    />
  );

  // Content with optional icon
  const content = (
    <>
      {isLoading && loadingSpinner}
      {!isLoading && iconPosition === "left" && iconComponent}
      {children}
      {!isLoading && iconPosition === "right" && iconComponent}
    </>
  );

  // Render as Link if 'to' prop is provided
  if (to) {
    return (
      <Link
        to={to}
        className={buttonClasses}
        aria-disabled={disabled} // For accessibility
        {...props}
      >
        {content}
      </Link>
    );
  }

  // Default button render
  return (
    <button
      className={buttonClasses}
      disabled={disabled || isLoading} // Combine disabled states
      {...props}
    >
      {content}
    </button>
  );
};

export default Button;
