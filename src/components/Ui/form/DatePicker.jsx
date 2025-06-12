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
  const handleDateChange = (date) => {
    if (!date) return onChange(null);

    // Create a new date object
    const adjustedDate = new Date(date);

    // Set to noon in LOCAL timezone (what the user sees)
    adjustedDate.setHours(12, 0, 0, 0);

    // Send the local date directly without UTC conversion
    onChange(adjustedDate);
  };

  // For display, use the date as-is (already in local time)
  const displayDate = selected ? new Date(selected) : null;

  return (
    <div className={`relative ${className}`}>
      <ReactDatePicker
        selected={displayDate}
        onChange={handleDateChange}
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
