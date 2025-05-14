import React, { useEffect, useState } from "react";
import { InputField, SelectField } from "../../../Ui/form/index";
import { PhoneIcon } from "@heroicons/react/24/outline";

const countryOptions = [
  { value: "AU", label: "🇦🇺 +61", code: "+61" },
  { value: "IN", label: "🇮🇳 +91", code: "+91" },
  { value: "SG", label: "🇸🇬 +65", code: "+65" },
  { value: "NP", label: "🇳🇵 +977", code: "+977" },
  { value: "US", label: "🇺🇸 +1", code: "+1" },
  { value: "GB", label: "🇬🇧 +44", code: "+44" },
  { value: "CA", label: "🇨🇦 +1", code: "+1" },
];

function PhoneField({ register, errors, setValue, watch }) {
  const [selectedCountry, setSelectedCountry] = useState("NP");
  const [phoneDigits, setPhoneDigits] = useState("");

  useEffect(() => {
    const detectCountry = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        const matchedCountry = countryOptions.find(
          (c) => c.value === data.country_code
        );
        if (matchedCountry) {
          setSelectedCountry(matchedCountry.value);
          // Set initial country code in form state
          setValue("countryCode", matchedCountry.code);
        }
      } catch (error) {
        console.error("Country detection failed:", error);
      }
    };

    detectCountry();
  }, [setValue]);

  const currentCountry = countryOptions.find(
    (c) => c.value === selectedCountry
  );

  // Handle phone number changes
  const handlePhoneChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "");
    setPhoneDigits(digits);
    // Combine country code with phone digits
    setValue("phone", `${currentCountry?.code}${digits}`, {
      shouldValidate: true,
    });
  };

  // Handle country selection changes
  const handleCountryChange = (e) => {
    const newCountry = e.target.value;
    setSelectedCountry(newCountry);
    const country = countryOptions.find((c) => c.value === newCountry);
    // Update both country code and combined phone number
    setValue("countryCode", country.code);
    setValue("phone", `${country.code}${phoneDigits}`, {
      shouldValidate: true,
    });
  };

  return (
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
      {/* Hidden field to store the combined phone number */}
      <input type="hidden" {...register("phone")} />
      {/* Hidden field to store just the country code */}
      <input type="hidden" {...register("countryCode")} />
    </div>
  );
}

export default PhoneField;
