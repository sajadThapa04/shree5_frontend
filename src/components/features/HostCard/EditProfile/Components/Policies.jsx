import React from "react";
import { useFormContext } from "react-hook-form";

function Policies() {
  const { register } = useFormContext();

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Policies</h2>
      <div>
        <label
          htmlFor="cancellation"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Cancellation Policy
        </label>
        <select
          id="cancellation"
          {...register("policies.cancellation")}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
        >
          <option value="flexible">Flexible</option>
          <option value="moderate">Moderate</option>
          <option value="strict">Strict</option>
        </select>
      </div>
    </div>
  );
}

export default Policies;
