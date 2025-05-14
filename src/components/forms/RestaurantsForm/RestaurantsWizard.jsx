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
  HomeIcon,
} from "@heroicons/react/24/outline";
import RestaurantsCard from "../../features/RestaurantsCard/RestaurantsCard";
import {
  BasicInformation,
  OpeningHours,
  Amenities,
  RestaurantImage,
} from "./Components/index";

const steps = [
  {
    component: BasicInformation,
    name: "Basic Information",
    fields: ["name", "cuisineDetails", "seatingCapacity"],
  },
  {
    component: OpeningHours,
    name: "Opening Hours",
    fields: ["openingHours"],
  },
  {
    component: Amenities,
    name: "Amenities",
  },
  {
    component: RestaurantImage,
    name: "Images",
  },
];

const RestaurantsWizard = ({ onSubmit, isLoading, error }) => {
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

    const fieldsToValidate = currentStepConfig.fields || [];
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
      // Prepare cuisine data with files
      const cuisineDetails =
        data.cuisineDetails?.map((cuisine) => ({
          name: cuisine.name,
          price: cuisine.price,
          image: cuisine.image,
        })) || [];

      // Prepare restaurant images
      const restaurantImages =
        data.images?.map((img) => ({
          file: img.file,
          preview: img.preview,
        })) || [];

      const formattedOpeningHours = Object.entries(data.openingHours || {}).map(
        ([day, slots]) => ({
          day: day.toLowerCase(),
          timeSlots: slots.map((slot) => ({
            openingTime: slot.openingTime,
            closingTime: slot.closingTime,
          })),
        })
      );

      const formattedData = {
        ...data,
        cuisineDetails,
        restaurantImages,
        openingHours: formattedOpeningHours,
        seatingCapacity: Number(data.seatingCapacity),
      };

      await onSubmit(formattedData);
    } catch (err) {
      console.error("Submission error:", err);
      throw err;
    } finally {
      setIsSubmitting(false);
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
      {/* Centered Home Button */}
      <div className="flex justify-center mb-6">
        <motion.button
          onClick={() => navigate("/")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 px-4 py-2 rounded-full text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-all duration-300"
        >
          <HomeIcon className="h-6 w-6" />
          <span className="font-medium">Home</span>
        </motion.button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 shadow-sm">
          {error.message || "An error occurred"}
        </div>
      )}

      {/* Main Content */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Create Your Restaurant
        </h1>
        <p className="text-gray-500 text-lg">
          Let's guide you through the process step by step
        </p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -50 : 50 }}
            transition={{ duration: 0.3 }}
          >
            <RestaurantsCard
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
            </RestaurantsCard>
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
                  Publish Restaurant
                </>
              )}
            </FormButton>
          )}
        </div>
      </form>
    </motion.div>
  );
};

export default RestaurantsWizard;
