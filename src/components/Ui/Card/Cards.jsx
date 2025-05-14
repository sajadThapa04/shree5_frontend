import React from "react";

const Card = ({
  children,
  className = "",
  onClick = () => {},
  withImage = false,
}) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-100 transition-shadow duration-300 ${className}`}
      onClick={onClick}
    >
      {withImage &&
        React.Children.toArray(children).find(
          (child) => child.type === Card.Image
        )}
      <div className="p-4">
        {React.Children.toArray(children).filter(
          (child) => child.type !== Card.Image
        )}
      </div>
    </div>
  );
};

// Add compound components
Card.Image = ({ src, alt, className = "" }) => (
  <div className="bg-gray-100 overflow-hidden">
    <img
      src={src}
      alt={alt}
      className={`w-full h-full object-cover ${className}`}
    />
  </div>
);

Card.Title = ({ children, className = "" }) => (
  <h3 className={`text-lg font-medium text-gray-900 mb-2 ${className}`}>
    {children}
  </h3>
);

Card.Description = ({ children, className = "" }) => (
  <p className={`text-gray-500 text-sm ${className}`}>{children}</p>
);

export default Card;
