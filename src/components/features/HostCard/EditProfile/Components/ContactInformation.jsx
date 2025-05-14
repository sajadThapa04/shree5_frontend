import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { InputField, SelectField } from "../../../../Ui/form";
import { PhoneIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

const countryOptions = [
  { value: "AU", label: "🇦🇺 +61", code: "+61" },
  { value: "IN", label: "🇮🇳 +91", code: "+91" },
  { value: "SG", label: "🇸🇬 +65", code: "+65" },
  { value: "NP", label: "🇳🇵 +977", code: "+977" },
  { value: "US", label: "🇺🇸 +1", code: "+1" },
  { value: "GB", label: "🇬🇧 +44", code: "+44" },
  { value: "CA", label: "🇨🇦 +1", code: "+1" },
];

function ContactInformation() {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
    getValues,
  } = useFormContext();

  const [selectedCountry, setSelectedCountry] = useState("NP");
  const [phoneDigits, setPhoneDigits] = useState("");

  // Initialize form values and state
  useEffect(() => {
    const detectCountry = async () => {
      try {
        // First try to get country from existing phone value
        const currentPhone = getValues("phone") || "";
        const countryFromPhone = countryOptions.find((option) =>
          currentPhone.startsWith(option.code)
        );

        if (countryFromPhone) {
          setSelectedCountry(countryFromPhone.value);
          setPhoneDigits(currentPhone.replace(countryFromPhone.code, ""));
          setValue("countryCode", countryFromPhone.code);
          return;
        }

        // Fallback to IP detection
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        const matchedCountry = countryOptions.find(
          (c) => c.value === data.country_code
        );
        if (matchedCountry) {
          setSelectedCountry(matchedCountry.value);
          setValue("countryCode", matchedCountry.code);
        }
      } catch (error) {
        console.error("Country detection failed:", error);
      }
    };

    detectCountry();
  }, [setValue, getValues]);

  const currentCountry = countryOptions.find(
    (c) => c.value === selectedCountry
  );

  // Handle phone number changes
  const handlePhoneChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "");
    setPhoneDigits(digits);
    if (currentCountry) {
      const fullPhone = `${currentCountry.code}${digits}`;
      setValue("phone", fullPhone, { shouldValidate: true });
      setValue("fullPhone", fullPhone);
    }
  };

  // Handle country selection changes
  const handleCountryChange = (e) => {
    const newCountry = e.target.value;
    setSelectedCountry(newCountry);
    const country = countryOptions.find((c) => c.value === newCountry);
    if (country) {
      setValue("countryCode", country.code);
      const fullPhone = `${country.code}${phoneDigits}`;
      setValue("phone", fullPhone, { shouldValidate: true });
      setValue("fullPhone", fullPhone);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Contact Information</h2>

      <div className="grid grid-cols-1 gap-6">
        {/* Phone Field */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <div className="flex gap-2 mt-1">
            <div className="w-1/3">
              <SelectField
                name="countryCode"
                value={selectedCountry}
                onChange={handleCountryChange}
                options={countryOptions}
                className="h-full"
              />
            </div>
            <div className="w-2/3">
              <InputField
                name="phoneNumber"
                type="tel"
                value={phoneDigits}
                onChange={handlePhoneChange}
                placeholder="1234567890"
                icon={<PhoneIcon className="h-5 w-5 text-gray-400" />}
                error={errors.phone?.message}
              />
            </div>
          </div>
          {/* Hidden fields to store the actual form values */}
          <input type="hidden" {...register("phone")} />
          <input type="hidden" {...register("countryCode")} />
          <input type="hidden" {...register("fullPhone")} />
        </div>

        {/* Email Field */}
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
      </div>
    </div>
  );
}

export default ContactInformation;
