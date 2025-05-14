// ListingType.jsx
import React from "react";
import { SelectField } from "../../../Ui/form";
import { BuildingStorefrontIcon } from "@heroicons/react/24/outline";

const listingTypeOptions = [
  { value: "restaurant", label: "Restaurant" },
  { value: "hotel", label: "Hotel" },
  { value: "lodge", label: "Lodge" },
  { value: "home_stay", label: "Home Stay" },
  { value: "luxury_villa", label: "Luxury Villa" },
];

function ListingType({ register, errors }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Listing Type</h2>
      <SelectField
        label="What type of property are you listing?"
        name="listingType"
        options={listingTypeOptions}
        error={errors.listingType?.message}
        icon={<BuildingStorefrontIcon className="h-5 w-5 text-gray-400" />}
        {...register("listingType", {
          required: "Listing type is required",
        })}
      />
    </div>
  );
}

export default ListingType;
