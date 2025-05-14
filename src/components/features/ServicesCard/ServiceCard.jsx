import React from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const ServiceCard = ({
  stepNumber,
  stepTitle,
  currentStep,
  totalSteps,
  children,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
      {/* Header with step indicator */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">
              Step {stepNumber} of {totalSteps}
            </span>
            <h2 className="mt-1 text-xl font-bold text-gray-900">
              {stepTitle}
            </h2>
          </div>

          {/* Step progress indicators */}
          <div className="flex items-center space-x-2">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full ${
                  index < currentStep
                    ? "bg-green-500" // Completed steps
                    : index === currentStep
                    ? "bg-rose-600" // Current step
                    : "bg-gray-300" // Future steps
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="p-6">
        {/* Completion indicator for completed steps */}
        {stepNumber - 1 < currentStep && (
          <div className="flex items-center mb-4 text-green-600">
            <CheckCircleIcon className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">Completed</span>
          </div>
        )}

        {/* The actual form content */}
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
};

export default ServiceCard;
