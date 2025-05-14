import React from "react";
import { InputField } from "../../../Ui/form/index";
import { EnvelopeIcon } from "@heroicons/react/24/outline";

function EmailField({ register, errors }) {
  return (
    <InputField
      label="Email"
      name="email"
      type="email"
      placeholder="contact@example.com"
      icon={<EnvelopeIcon className="h-5 w-5 text-gray-400" />}
      error={errors.email?.message}
      {...register("email", {
        required: "Email is required",
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: "Invalid email address",
        },
      })}
    />
  );
}

export default EmailField;
