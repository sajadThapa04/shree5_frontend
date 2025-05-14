// BusinessName.jsx
import React from "react";
import { InputField } from "../../../Ui/form/index";
function BusinessName({ register, errors }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">
        Business Information
      </h2>
      <InputField
        label="Business Name"
        name="name"
        placeholder="Grand Hotel"
        error={errors.name?.message}
        {...register("name", {
          required: "Business name is required",
          minLength: {
            value: 3,
            message: "Name must be at least 3 characters",
          },
        })}
      />
    </div>
  );
}

export default BusinessName;
