// Policies.jsx
import React from "react";
import { SelectField, CheckboxField } from "../../../Ui/form/index";

const cancellationPolicyOptions = [
  { value: "flexible", label: "Flexible" },
  { value: "moderate", label: "Moderate" },
  { value: "strict", label: "Strict" },
];

function Policies({ register, errors }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Policies</h2>

      <SelectField
        label="Cancellation Policy"
        name="policies.cancellation"
        options={cancellationPolicyOptions}
        error={errors.policies?.cancellation?.message}
        {...register("policies.cancellation", {
          required: "Cancellation policy is required",
        })}
      />

      <CheckboxField
        name="termsAccepted"
        label={
          <span>
            I confirm that this information is accurate and agree to the{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Host Terms
            </a>
          </span>
        }
        error={errors.termsAccepted?.message}
        {...register("termsAccepted", {
          required: "You must accept the terms",
        })}
      />
    </div>
  );
}

export default Policies;
