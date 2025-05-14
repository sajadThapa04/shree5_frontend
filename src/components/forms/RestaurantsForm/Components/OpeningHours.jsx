import React, { useState, useEffect } from "react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const OpeningHours = ({ register, control, errors, setValue, watch }) => {
  const [timeSlots, setTimeSlots] = useState(
    daysOfWeek.reduce((acc, day) => {
      acc[day.toLowerCase()] = [{ openingTime: "", closingTime: "" }];
      return acc;
    }, {})
  );

  // Initialize form values for each day
  useEffect(() => {
    daysOfWeek.forEach((day) => {
      const dayLower = day.toLowerCase();
      setValue(`openingHours.${dayLower}`, timeSlots[dayLower]);
    });
  }, []);
  const addTimeSlot = (day) => {
    setTimeSlots((prev) => ({
      ...prev,
      [day]: [...prev[day], { openingTime: "", closingTime: "" }],
    }));
  };

  const removeTimeSlot = (day, index) => {
    if (timeSlots[day].length > 1) {
      const updated = { ...timeSlots };
      updated[day].splice(index, 1);
      setTimeSlots(updated);
    }
  };

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Opening Hours</h2>
        <p className="text-sm text-gray-500 mt-2">
          Set your weekly opening hours. Add multiple time slots if you close
          during the day.
        </p>
      </div>

      <div className="space-y-6">
        {daysOfWeek.map((day) => {
          const dayLower = day.toLowerCase();
          return (
            <div
              key={dayLower}
              className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-medium text-gray-700 capitalize">
                  {day}
                </h3>
                <button
                  type="button"
                  onClick={() => addTimeSlot(dayLower)}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                >
                  <PlusIcon className="-ml-1 mr-1 h-4 w-4" />
                  Add Slot
                </button>
              </div>

              <div className="space-y-4">
                {timeSlots[dayLower].map((_, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Opening Time *
                      </label>
                      <input
                        type="time"
                        {...register(
                          `openingHours.${dayLower}.${index}.openingTime`,
                          {
                            required: `Opening time is required`,
                          }
                        )}
                        className={`block w-full px-4 py-3 text-base rounded-lg border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 ${
                          errors.openingHours?.[dayLower]?.[index]?.openingTime
                            ? "border-red-500"
                            : "border"
                        }`}
                      />
                      {errors.openingHours?.[dayLower]?.[index]
                        ?.openingTime && (
                        <p className="mt-1 text-sm text-red-600">
                          {
                            errors.openingHours[dayLower][index].openingTime
                              .message
                          }
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-center pt-5">
                      <span className="text-gray-500">to</span>
                    </div>

                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Closing Time *
                      </label>
                      <input
                        type="time"
                        {...register(
                          `openingHours.${dayLower}.${index}.closingTime`,
                          {
                            required: `Closing time is required`,
                          }
                        )}
                        className={`block w-full px-4 py-3 text-base rounded-lg border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 ${
                          errors.openingHours?.[dayLower]?.[index]?.closingTime
                            ? "border-red-500"
                            : "border"
                        }`}
                      />
                      {errors.openingHours?.[dayLower]?.[index]
                        ?.closingTime && (
                        <p className="mt-1 text-sm text-red-600">
                          {
                            errors.openingHours[dayLower][index].closingTime
                              .message
                          }
                        </p>
                      )}
                    </div>

                    {timeSlots[dayLower].length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTimeSlot(dayLower, index)}
                        className="mt-7 inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-red-600 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OpeningHours;
