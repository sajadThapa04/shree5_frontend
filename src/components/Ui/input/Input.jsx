import React from "react";

const Input = ({
  type = "text",
  placeholder = "",
  value = "",
  onChange = () => {},
  className = "",
  ...props
}) => {
  const baseClasses =
    "block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 transition duration-300";

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`${baseClasses} ${className}`}
      {...props}
    />
  );
};

export default Input;
