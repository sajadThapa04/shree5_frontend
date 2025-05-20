import React from "react";

const OpeningHours = ({ openingHours }) => {
  if (!openingHours || openingHours.length === 0) return null;

  return (
    <div className="space-y-2">
      {openingHours.map((day, index) => (
        <div key={index} className="flex justify-between">
          <span className="text-gray-600 capitalize">{day.day}:</span>
          <div className="text-gray-600">
            {day.timeSlots.map((slot, slotIndex) => (
              <span key={slotIndex}>
                {slot.openingTime} - {slot.closingTime}
                {slotIndex < day.timeSlots.length - 1 && ', '}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OpeningHours;