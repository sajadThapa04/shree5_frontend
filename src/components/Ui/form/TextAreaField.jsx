import React from "react";

const TextareaField = ({
  label,
  name,
  placeholder = "",
  rows = 3,
  error = "",
  disabled = false,
  className = "",
  icon,
  ...props
}) => {
  return (
    <div className={`mb-6 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
            {icon}
          </div>
        )}
        <textarea
          id={name}
          name={name}
          rows={rows}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full ${
            icon ? "pl-10" : "pl-3"
          } pr-3 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2  focus:border-transparent transition-all duration-200 ${
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 hover:border-gray-400"
          } ${
            disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"
          } text-gray-700 resize-none`} // Added resize-none here
          {...props}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center">
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default TextareaField;
