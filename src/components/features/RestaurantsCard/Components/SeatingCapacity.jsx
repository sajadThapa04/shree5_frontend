import React from "react";
import { MdOutlineReduceCapacity } from "react-icons/md";

const SeatingCapacity = ({ capacity }) => {
  return (
    <div className="flex items-center">
      <MdOutlineReduceCapacity className="h-5 w-5 text-rose-500 mr-3" />
      <div>
        <p className="text-xs font-medium text-gray-500">Capacity</p>
        <p className="font-medium text-gray-900">{capacity} seats</p>
      </div>
    </div>
  );
};

export default SeatingCapacity;
