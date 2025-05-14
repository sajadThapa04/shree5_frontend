import React from "react";

const CheckboxField = ({
  label,
  name,
  checked,
  onChange,
  error = "",
  disabled = false,
  className = "",
  ...props
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      <div className="flex items-center">
        <input
          type="checkbox"
          id={name}
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${
            disabled ? "bg-gray-100 cursor-not-allowed" : ""
          }`}
          {...props}
        />
        {label && (
          <label htmlFor={name} className="ml-2 block text-sm text-gray-700">
            {label}
          </label>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default CheckboxField;
