// OpeningHours.js
import React, { useState, useEffect } from "react";
import { PlusIcon, TrashIcon, CheckIcon } from "@heroicons/react/24/outline";

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
      const dayLower = day.toLowerCase();
      acc[dayLower] = {
        is24Hours: false,
        slots: watch(`openingHours.${dayLower}`) || [
          { openingTime: "08:00", closingTime: "20:00" },
        ],
      };
      return acc;
    }, {})
  );

  // Initialize form values for each day
  useEffect(() => {
    daysOfWeek.forEach((day) => {
      const dayLower = day.toLowerCase();
      setValue(`openingHours.${dayLower}`, timeSlots[dayLower].slots);
      setValue(`openingHours.${dayLower}_24h`, timeSlots[dayLower].is24Hours);
    });
  }, []);

  const addTimeSlot = (day) => {
    const newSlots = [
      ...timeSlots[day].slots,
      { openingTime: "", closingTime: "" },
    ];
    setTimeSlots((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: newSlots,
      },
    }));
    setValue(`openingHours.${day}`, newSlots);
  };

  const removeTimeSlot = (day, index) => {
    if (timeSlots[day].slots.length > 1) {
      const newSlots = [...timeSlots[day].slots];
      newSlots.splice(index, 1);
      setTimeSlots((prev) => ({
        ...prev,
        [day]: {
          ...prev[day],
          slots: newSlots,
        },
      }));
      setValue(`openingHours.${day}`, newSlots);
    }
  };

  const toggle24Hours = (day) => {
    const newValue = !timeSlots[day].is24Hours;
    const newSlots = newValue
      ? []
      : [{ openingTime: "08:00", closingTime: "20:00" }];

    setTimeSlots((prev) => ({
      ...prev,
      [day]: {
        is24Hours: newValue,
        slots: newSlots,
      },
    }));

    setValue(`openingHours.${day}`, newSlots);
    setValue(`openingHours.${day}_24h`, newValue);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Opening Hours</h2>
        <p className="text-sm text-gray-500 mt-2">
          Set your weekly opening hours. You can mark days as 24 hours or add
          specific time slots.
        </p>
      </div>

      <div className="space-y-4">
        {daysOfWeek.map((day) => {
          const dayLower = day.toLowerCase();
          const is24Hours = timeSlots[dayLower]?.is24Hours;

          return (
            <div
              key={dayLower}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <h3 className="font-medium text-gray-700 capitalize">
                    {day}
                  </h3>
                  <button
                    type="button"
                    onClick={() => toggle24Hours(dayLower)}
                    className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${
                      is24Hours
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {is24Hours && <CheckIcon className="h-3 w-3 mr-1" />}
                    24 Hours
                  </button>
                </div>

                {!is24Hours && (
                  <button
                    type="button"
                    onClick={() => addTimeSlot(dayLower)}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full text-white bg-rose-600 hover:bg-rose-700"
                  >
                    <PlusIcon className="h-3 w-3 mr-1" />
                    Add Slot
                  </button>
                )}
              </div>

              {is24Hours ? (
                <div className="text-sm text-gray-500 italic">
                  Open 24 hours
                </div>
              ) : (
                <div className="space-y-3">
                  {timeSlots[dayLower]?.slots?.map((slot, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Opening Time
                        </label>
                        <input
                          type="time"
                          {...register(
                            `openingHours.${dayLower}.${index}.openingTime`,
                            { required: !is24Hours }
                          )}
                          defaultValue={slot.openingTime}
                          className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
                          disabled={is24Hours}
                        />
                      </div>

                      <span className="text-xs text-gray-400 mt-5">to</span>

                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Closing Time
                        </label>
                        <input
                          type="time"
                          {...register(
                            `openingHours.${dayLower}.${index}.closingTime`,
                            { required: !is24Hours }
                          )}
                          defaultValue={slot.closingTime}
                          className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
                          disabled={is24Hours}
                        />
                      </div>

                      {timeSlots[dayLower].slots.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTimeSlot(dayLower, index)}
                          className="mt-5 text-gray-400 hover:text-red-500"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OpeningHours;
