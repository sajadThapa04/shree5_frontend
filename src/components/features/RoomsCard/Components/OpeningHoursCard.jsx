import React, { useState } from "react";
import { FaClock, FaChevronDown, FaChevronUp } from "react-icons/fa";

const OpeningHoursCard = ({ openingHours }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const today = days[new Date().getDay()];

  const formatTimeToAMPM = (time) => {
    if (!time) return "";
    
    const [hours, minutes] = time.split(':');
    const hourNum = parseInt(hours, 10);
    
    if (hourNum === 0) return `12:${minutes} AM`;
    if (hourNum === 12) return `12:${minutes} PM`;
    
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const hour12 = hourNum % 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const formatTimeSlots = (slots) => {
    if (!slots || slots.length === 0) {
      return <span className="text-gray-400">Closed</span>;
    }

    const is24Hours = slots.some(slot => 
      slot?.openingTime === "00:00" && slot?.closingTime === "23:59"
    );

    return (
      <div className="flex flex-col space-y-1 mt-1">
        {is24Hours ? (
          <span className="text-gray-600">Open 24 hours</span>
        ) : (
          slots
            .filter((slot) => slot?.openingTime && slot?.closingTime)
            .map((slot, index) => (
              <span key={index} className="text-gray-600">
                {formatTimeToAMPM(slot.openingTime)} - {formatTimeToAMPM(slot.closingTime)}
              </span>
            ))
        )}
      </div>
    );
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
          <FaClock className="text-rose-500" />
          Opening Hours
        </h3>
        {isExpanded ? (
          <FaChevronUp className="text-gray-500" />
        ) : (
          <FaChevronDown className="text-gray-500" />
        )}
      </div>

      {isExpanded && (
        <div
          className="mt-4 max-h-60 overflow-y-auto pr-2"
          style={{ scrollbarWidth: "thin" }}
        >
          <div className="space-y-3">
            {days.map((day) => {
              const dayHours = openingHours?.find((d) => d?.day === day);
              const slots = dayHours?.timeSlots || [];
              const isToday = day === today;

              return (
                <div
                  key={day}
                  className={`p-3 rounded-lg ${
                    isToday ? "bg-rose-50" : "hover:bg-gray-50"
                  }`}
                >
                  <span
                    className={`capitalize font-medium ${
                      isToday ? "text-rose-600" : "text-gray-800"
                    }`}
                  >
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                    {isToday && (
                      <span className="ml-2 text-xs text-rose-500">
                        (Today)
                      </span>
                    )}
                  </span>
                  {formatTimeSlots(slots)}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default OpeningHoursCard;