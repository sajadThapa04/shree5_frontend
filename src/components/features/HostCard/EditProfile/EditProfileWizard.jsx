import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { Button } from "../../../Ui";
import {
  BasicInformation,
  ContactInformation,
  Address,
  Policies,
} from "./Components/index";
import { FormProvider } from "react-hook-form";

const steps = [
  {
    component: BasicInformation,
    name: "Basic Info",
    fields: ["name", "description"],
  },
  {
    component: ContactInformation,
    name: "Contact",
    fields: ["phone", "email", "countryCode", "fullPhone"], // Added countryCode and fullPhone here
  },
  {
    component: Address,
    name: "Address",
    fields: [
      "address.street",
      "address.city",
      "address.country",
      "address.zipCode", // Add this if you have zipCode
      "coordinates", // Add coordinates to validation
    ],
  },
  {
    component: Policies,
    name: "Policies",
    fields: ["policies.cancellation"],
  },
];

function EditProfileWizard({ onSubmit, isLoading, initialValues }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const methods = useForm({
    defaultValues: initialValues || {
      name: "",
      description: "",
      phone: "",
      email: "",
      countryCode: "+977", // Added default countryCode
      fullPhone: "", // Added fullPhone
      address: {
        street: "",
        city: "",
        country: "",
      },
      policies: {
        cancellation: "moderate",
      },
    },
  });

  const {
    handleSubmit,
    trigger,
    formState: { errors },
  } = methods;

  const nextStep = async (e) => {
    e?.preventDefault();
    const currentFields = steps[currentStep].fields;
    const isValid = await trigger(currentFields);

    if (isValid) {
      setDirection(1);
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setDirection(-1);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <FormProvider {...methods}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto px-4 sm:px-6"
      >
        {/* Progress Steps - Mobile */}
        <div className="md:hidden mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center font-medium">
                {currentStep + 1}
              </div>
              <span className="ml-2 font-medium text-gray-700">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              {steps[currentStep].name}
            </span>
          </div>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-rose-600 h-2 rounded-full"
              style={{
                width: `${((currentStep + 1) / steps.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Progress Steps - Desktop */}
        <div className="hidden md:flex justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.name} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  index <= currentStep
                    ? "bg-rose-600 text-white"
                    : "bg-gray-200 text-gray-600"
                } font-medium`}
              >
                {index + 1}
              </div>
              <span
                className={`mt-2 text-sm ${
                  index === currentStep
                    ? "font-medium text-rose-600"
                    : "text-gray-500"
                }`}
              >
                {step.name}
              </span>
            </div>
          ))}
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {" "}
          {/* Moved submit handler here */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -50 : 50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 p-4 sm:p-6 md:p-8">
                <CurrentStepComponent />
              </div>
            </motion.div>
          </AnimatePresence>
          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6 sm:mt-8">
            {currentStep > 0 ? (
              <Button
                type="button"
                variant="secondary"
                onClick={prevStep}
                className="flex items-center px-4 py-2 sm:px-6 sm:py-3"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            ) : (
              <div></div>
            )}

            {currentStep < steps.length - 1 ? (
              <Button
                type="button"
                variant="primary"
                onClick={nextStep}
                className="flex items-center px-4 py-2 sm:px-6 sm:py-3"
              >
                <span className="hidden sm:inline">Continue</span>
                <ArrowRightIcon className="h-5 w-5 ml-0 sm:ml-2" />
              </Button>
            ) : (
              <Button
                type="submit"
                variant="primary"
                disabled={isLoading}
                className="flex items-center px-4 py-2 sm:px-6 sm:py-3"
              >
                {isLoading ? (
                  <>
                    <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />
                    <span className="hidden sm:inline">Saving...</span>
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                    <span className="hidden sm:inline">Save Changes</span>
                  </>
                )}
                <span className="sm:hidden">Save</span>
              </Button>
            )}
          </div>
        </form>
      </motion.div>
    </FormProvider>
  );
}

export default EditProfileWizard;
