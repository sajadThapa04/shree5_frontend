// Description.jsx
import React from "react";
import { TextareaField } from "../../../Ui/form/index";

function Description({ register, errors }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">
        Business Description
      </h2>
      <TextareaField
        label="Description"
        name="description"
        placeholder="Tell us about your business..."
        rows={4}
        error={errors.description?.message}
        {...register("description", {
          required: "Description is required",
          minLength: {
            value: 20,
            message: "Description must be at least 20 characters",
          },
        })}
      />
    </div>
  );
}

export default Description;
