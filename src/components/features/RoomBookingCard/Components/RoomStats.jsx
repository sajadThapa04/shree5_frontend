// components/RoomBooking/RoomStats.jsx
import { FaUser, FaRulerCombined, FaBed } from "react-icons/fa";

const RoomStats = ({ capacity, size, roomType }) => {
  return (
    <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex flex-col items-center">
        <FaUser className="text-rose-500 mb-1" />
        <span className="text-sm text-gray-600">Capacity</span>
        <span className="font-medium">
          {capacity.adults + capacity.children}
        </span>
      </div>
      <div className="flex flex-col items-center">
        <FaRulerCombined className="text-rose-500 mb-1" />
        <span className="text-sm text-gray-600">Size</span>
        <span className="font-medium">{size} sq.ft</span>
      </div>
      <div className="flex flex-col items-center">
        <FaBed className="text-rose-500 mb-1" />
        <span className="text-sm text-gray-600">Type</span>
        <span className="font-medium capitalize">{roomType}</span>
      </div>
    </div>
  );
};

export default RoomStats;
