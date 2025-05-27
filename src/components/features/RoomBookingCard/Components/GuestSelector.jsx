// components/RoomBooking/GuestSelector.jsx
import { useState } from "react";
import { FiUser, FiPlus, FiMinus } from "react-icons/fi";

const GuestSelector = ({ register, errors, roomCapacity }) => {
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [childrenAges, setChildrenAges] = useState([]);
  const [showAgeInputs, setShowAgeInputs] = useState(false);

  const maxGuests = roomCapacity.adults + roomCapacity.children;

  const handleAdultChange = (increment) => {
    const newValue = adults + increment;
    if (
      newValue >= 1 &&
      newValue <= roomCapacity.adults &&
      newValue + children <= maxGuests
    ) {
      setAdults(newValue);
    }
  };

  const handleChildChange = (increment) => {
    const newValue = children + increment;
    if (
      newValue >= 0 &&
      newValue <= roomCapacity.children &&
      adults + newValue <= maxGuests
    ) {
      setChildren(newValue);
      if (increment === 1) {
        setChildrenAges([...childrenAges, ""]);
      } else {
        setChildrenAges(childrenAges.slice(0, -1));
      }
    }
  };

  const handleAgeChange = (index, value) => {
    const newAges = [...childrenAges];
    newAges[index] = value;
    setChildrenAges(newAges);
  };

  return (
    <div className="space-y-6">
      {/* Hidden inputs for form submission */}
      <input
        type="hidden"
        {...register("numberOfGuests")}
        value={adults + children}
      />
      <input
        type="hidden"
        {...register("childrenAges")}
        value={JSON.stringify(childrenAges)}
      />

      {/* Adults Selection */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-medium text-gray-700">Adults</h3>
            <p className="text-xs text-gray-500">Age 18+</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => handleAdultChange(-1)}
              disabled={adults <= 1}
              className="p-1 rounded-full text-gray-400 hover:text-rose-500 disabled:opacity-30"
            >
              <FiMinus className="h-4 w-4" />
            </button>
            <span className="w-6 text-center">{adults}</span>
            <button
              type="button"
              onClick={() => handleAdultChange(1)}
              disabled={
                adults >= roomCapacity.adults || adults + children >= maxGuests
              }
              className="p-1 rounded-full text-gray-400 hover:text-rose-500 disabled:opacity-30"
            >
              <FiPlus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Children Selection */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-medium text-gray-700">Children</h3>
            <p className="text-xs text-gray-500">Ages 0-17</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => handleChildChange(-1)}
              disabled={children <= 0}
              className="p-1 rounded-full text-gray-400 hover:text-rose-500 disabled:opacity-30"
            >
              <FiMinus className="h-4 w-4" />
            </button>
            <span className="w-6 text-center">{children}</span>
            <button
              type="button"
              onClick={() => {
                handleChildChange(1);
                setShowAgeInputs(true);
              }}
              disabled={
                children >= roomCapacity.children ||
                adults + children >= maxGuests
              }
              className="p-1 rounded-full text-gray-400 hover:text-rose-500 disabled:opacity-30"
            >
              <FiPlus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Children Age Inputs */}
        {showAgeInputs && children > 0 && (
          <div className="mt-4 space-y-3">
            <p className="text-xs text-gray-600">
              To find a place to stay that fits your entire group along with
              correct prices, we need to know how old your children will be at
              check-out
            </p>
            {Array.from({ length: children }).map((_, index) => (
              <div key={index} className="flex items-center">
                <label className="text-sm text-gray-600 mr-2">
                  Child {index + 1} age:
                </label>
                <input
                  type="number"
                  min="0"
                  max="17"
                  value={childrenAges[index] || ""}
                  onChange={(e) => handleAgeChange(index, e.target.value)}
                  className="w-16 px-2 py-1 border-b border-gray-300 focus:border-rose-500 focus:outline-none"
                  placeholder="Age"
                />
                <span className="ml-1 text-sm text-gray-500">years old</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rooms Selection */}
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-700">Rooms</h3>
        <span className="text-sm text-gray-600">1</span>
      </div>

      {errors.numberOfGuests && (
        <p className="mt-2 text-sm text-rose-600">
          {errors.numberOfGuests.message}
        </p>
      )}
    </div>
  );
};

export default GuestSelector;
