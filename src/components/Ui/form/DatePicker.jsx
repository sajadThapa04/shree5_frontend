import React from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiCalendar } from "react-icons/fi";

const DatePicker = ({
  selected,
  onChange,
  minDate,
  maxDate,
  placeholderText,
  className = "",
  error,
  required = false,
  ...props
}) => {
  return (
    <div className={`relative ${className}`}>
      <ReactDatePicker
        selected={selected ? new Date(selected) : null}
        onChange={onChange}
        minDate={minDate}
        maxDate={maxDate}
        placeholderText={placeholderText}
        className={`w-full p-2 pl-10 border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-md focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors`}
        required={required}
        dateFormat="MMMM d, yyyy"
        {...props}
      />
      <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error.message || "This field is required"}
        </p>
      )}
    </div>
  );
};

export default DatePicker;
