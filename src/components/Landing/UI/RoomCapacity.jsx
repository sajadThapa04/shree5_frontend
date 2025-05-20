import React from "react";
import { UserIcon } from "@heroicons/react/24/outline";

const RoomCapacity = ({ adults, children }) => {
  return (
    <div className="flex items-center">
      <UserIcon className="h-5 w-5 text-gray-500 mr-2" />
      <span className="text-gray-600">
        {adults} {adults === 1 ? 'Adult' : 'Adults'}
        {children > 0 && `, ${children} ${children === 1 ? 'Child' : 'Children'}`}
      </span>
    </div>
  );
};

export default RoomCapacity;