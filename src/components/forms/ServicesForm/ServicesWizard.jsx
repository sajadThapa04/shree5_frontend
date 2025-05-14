import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FormButton } from "../../Ui/form/index";
import {
  ArrowPathIcon,
  CheckBadgeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import ServiceCard from "../../features/ServicesCard/ServiceCard";
import { NameAndListingType, Location } from "./Components/index";

const steps = [
  {
    component: NameAndListingType,
    name: "Name & Type",
    fields: ["name", "type"],
  },
  { component: Location, name: "Location", fields: "coordinates" },
];

const ServicesFormWizard = ({ onSubmit, isLoading, error }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [direction, setDirection] = useState(1);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const nextStep = async (e) => {
    e?.preventDefault();
    const currentStepConfig = steps[currentStep];

    const fieldsToValidate =
      currentStepConfig.fields ||
      (currentStepConfig.field ? [currentStepConfig.field] : []);

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setDirection(1);
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setDirection(-1);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleFormSubmit = async (data) => {
    if (!onSubmit) {
      console.error("No onSubmit function available");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } catch (err) {
      console.error("Submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (currentStep < steps.length - 1) {
        nextStep(e);
      } else {
        handleSubmit(handleFormSubmit)();
      }
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-4 md:p-6"
    >
  
      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 shadow-sm">
          {error.message || "An error occurred"}
        </div>
      )}

      {/* Main Content */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Create Your Service Listing
        </h1>
        <p className="text-gray-500 text-lg">
          Let's guide you through the process step by step
        </p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} onKeyDown={handleKeyDown}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -50 : 50 }}
            transition={{ duration: 0.3 }}
          >
            <ServiceCard
              stepNumber={currentStep + 1}
              stepTitle={steps[currentStep].name}
              currentStep={currentStep}
              totalSteps={steps.length}
            >
              <CurrentStepComponent
                register={register}
                control={control}
                errors={errors}
                setValue={setValue}
                watch={watch}
              />
            </ServiceCard>
          </motion.div>
        </AnimatePresence>

        {/* Form Navigation Buttons */}
        <div className="flex justify-between mt-10">
          {currentStep > 0 && (
            <FormButton
              type="button"
              variant="secondary"
              onClick={prevStep}
              className="px-6 py-3.5 rounded-xl border border-gray-300 hover:bg-gray-50 transition-all duration-200 flex items-center"
            >
              <ChevronLeftIcon className="w-5 h-5 mr-2" />
              Back
            </FormButton>
          )}

          {currentStep < steps.length - 1 ? (
            <FormButton
              type="button"
              variant="primary"
              onClick={nextStep}
              className="px-8 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition-all duration-200 shadow-md hover:shadow-lg flex items-center"
            >
              Continue
              <ChevronRightIcon className="w-5 h-5 ml-2" />
            </FormButton>
          ) : (
            <FormButton
              type="submit"
              variant="primary"
              disabled={isSubmitting || isLoading}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-md hover:shadow-lg transition-all duration-200 hover:from-rose-700 hover:to-rose-800 flex items-center"
            >
              {isSubmitting || isLoading ? (
                <>
                  <ArrowPathIcon className="h-5 w-5 animate-spin mr-2" />
                  Publishing...
                </>
              ) : (
                <>
                  <CheckBadgeIcon className="h-5 w-5 mr-2" />
                  Publish Service
                </>
              )}
            </FormButton>
          )}
        </div>
      </form>
    </motion.div>
  );
};

export default ServicesFormWizard;
