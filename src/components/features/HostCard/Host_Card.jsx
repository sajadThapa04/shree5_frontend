// Host_Card.jsx
import React from "react";
import { motion } from "framer-motion";

const Host_Card = ({
  children,
  className = "",
  stepNumber,
  stepTitle,
  currentStep,
  totalSteps,
}) => {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl shadow-lg border border-gray-100 bg-white ${className}`}
    >
      {/* Progress bar at top */}
      <div className="h-1.5 bg-gray-100 w-full">
        <div
          className="h-full bg-rose-500 transition-all duration-500"
          style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
        ></div>
      </div>

      {/* Card header with step indicator */}
      <div className="px-8 pt-6 pb-4 border-b border-gray-100">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-rose-500 text-white font-medium text-lg mr-4">
            {stepNumber}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{stepTitle}</h3>
            <p className="text-sm text-gray-500">
              Step {stepNumber} of {totalSteps}
            </p>
          </div>
        </div>
      </div>

      {/* Animated content area */}
      <motion.div
        initial={{ opacity: 0.8, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-8"
      >
        {children}
      </motion.div>
    </div>
  );
};

export default Host_Card;
