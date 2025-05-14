import React from "react";

const daysOfWeek = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const Availability = ({ register, isAvailable, onAvailabilityChange }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Availability</h2>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isAvailable"
            checked={isAvailable}
            onChange={(e) =>
              onAvailabilityChange && onAvailabilityChange(e.target.checked)
            }
            className="h-4 w-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
          />
          <label
            htmlFor="isAvailable"
            className="ml-2 block text-sm text-gray-900"
          >
            This room is currently available for booking
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Opening Hours
          </label>
          <div className="space-y-4">
            {daysOfWeek.map((day, index) => (
              <div
                key={day}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center"
              >
                <div className="text-sm font-medium text-gray-700 capitalize">
                  {day}
                </div>
                <div>
                  <label className="sr-only">Opening Time</label>
                  <input
                    type="time"
                    {...register(
                      `openingHours.${index}.timeSlots.0.openingTime`
                    )}
                    className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="sr-only">Closing Time</label>
                  <input
                    type="time"
                    {...register(
                      `openingHours.${index}.timeSlots.0.closingTime`
                    )}
                    className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Availability;
