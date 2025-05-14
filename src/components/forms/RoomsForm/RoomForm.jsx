// RoomForm.js
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../Ui/index";
import { Link } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import {
  BasicInformation,
  CapacityAndDetails,
  AmenitiesAndTag,
  RoomImages,
  OpeningHours,
  PropertyImage,
} from "./Components/index";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const RoomForm = ({ onSubmit, isSubmitting }) => {
  const [roomImages, setRoomImages] = useState([]);
  const [propertyImages, setPropertyImages] = useState([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      capacity: { adults: 1, children: 0 },
      isAvailable: true,
      amenities: [],
      tags: [],
      openingHours: daysOfWeek.reduce((acc, day) => {
        const dayLower = day.toLowerCase();
        acc[dayLower] = [{ openingTime: "08:00", closingTime: "20:00" }];
        return acc;
      }, {}),
    },
  });

  const handleFormSubmit = (data) => {
    // Transform the opening hours data before submission
    const transformedOpeningHours = daysOfWeek.reduce((acc, day) => {
      const dayLower = day.toLowerCase();
      const is24Hours = data.openingHours[`${dayLower}_24h`];

      if (is24Hours) {
        acc[dayLower] = [{ openingTime: "00:00", closingTime: "23:59" }];
      } else {
        acc[dayLower] = data.openingHours[dayLower] || [];
      }

      return acc;
    }, {});

    onSubmit({
      ...data,
      roomImages,
      propertyImages,
      openingHours: transformedOpeningHours,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mt-4">
            Create New Room
          </h1>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
          <BasicInformation register={register} errors={errors} />
          <CapacityAndDetails register={register} errors={errors} />
          <AmenitiesAndTag
            register={register}
            setValue={setValue}
            control={control}
            watch={watch}
          />
          <OpeningHours
            register={register}
            control={control}
            errors={errors}
            setValue={setValue}
            watch={watch}
          />
          <PropertyImage
            propertyImages={propertyImages}
            setPropertyImages={setPropertyImages}
          />
          <RoomImages roomImages={roomImages} setRoomImages={setRoomImages} />

          <div className="flex justify-end">
            <div className="flex justify-end mt-8">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3 text-lg font-medium rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating Room...
                  </span>
                ) : (
                  "Create Room"
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomForm;
