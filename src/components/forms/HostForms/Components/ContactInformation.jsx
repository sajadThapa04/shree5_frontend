// import React, { useEffect, useState } from "react";
// import { InputField, SelectField } from "../../../Ui/form/index";
// import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";

// const countryOptions = [
//   { value: "AU", label: "🇦🇺 +61", code: "+61" },
//   { value: "IN", label: "🇮🇳 +91", code: "+91" },
//   { value: "SG", label: "🇸🇬 +65", code: "+65" },
//   { value: "NP", label: "🇳🇵 +977", code: "+977" },
//   { value: "US", label: "🇺🇸 +1", code: "+1" },
//   { value: "GB", label: "🇬🇧 +44", code: "+44" },
//   { value: "CA", label: "🇨🇦 +1", code: "+1" },
// ];

// function ContactInformation({ register, errors, setValue }) {
//   const [selectedCountry, setSelectedCountry] = useState("NP");
//   const [phoneDigits, setPhoneDigits] = useState("");
//   const [isDetectingCountry, setIsDetectingCountry] = useState(true);
//   const [phoneTouched, setPhoneTouched] = useState(false);

//   // Get current country
//   const currentCountry = countryOptions.find(
//     (c) => c.value === selectedCountry
//   );

//   useEffect(() => {
//     const detectCountry = async () => {
//       try {
//         const response = await fetch("https://ipapi.co/json/");
//         const data = await response.json();
//         const matchedCountry = countryOptions.find(
//           (c) => c.value === data.country_code
//         );
//         const country =
//           matchedCountry || countryOptions.find((c) => c.value === "NP");

//         setSelectedCountry(country.value);
//       } catch (error) {
//         console.error("Country detection failed:", error);
//         setSelectedCountry("NP");
//       } finally {
//         setIsDetectingCountry(false);
//       }
//     };

//     detectCountry();
//   }, []);

//   const handlePhoneChange = (e) => {
//     const digits = e.target.value.replace(/\D/g, "");
//     setPhoneDigits(digits);
//     const fullPhone = `${currentCountry.code}${digits}`;
//     setValue("phone", fullPhone, { shouldValidate: true });
//     setPhoneTouched(true);
//   };

//   const handleCountryChange = (e) => {
//     const countryValue = e.target.value;
//     setSelectedCountry(countryValue);
//     const country = countryOptions.find((c) => c.value === countryValue);
//     const fullPhone = `${country.code}${phoneDigits}`;
//     setValue("phone", fullPhone, { shouldValidate: true });
//     setPhoneTouched(true);
//   };

//   return (
//     <div className="space-y-4">
//       <h2 className="text-xl font-semibold text-gray-800">
//         Contact Information
//       </h2>

//       <InputField
//         label="Email"
//         name="email"
//         type="email"
//         placeholder="contact@example.com"
//         icon={<EnvelopeIcon className="h-5 w-5 text-gray-400" />}
//         error={errors.email?.message}
//         {...register("email", {
//           required: "Email is required",
//           pattern: {
//             value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//             message: "Invalid email address",
//           },
//         })}
//       />

//       <div className="space-y-1">
//         <label className="block text-sm font-medium text-gray-700">
//           Phone Number
//         </label>
//         {isDetectingCountry ? (
//           <div className="flex items-center space-x-2">
//             <div className="animate-pulse bg-gray-200 rounded-md h-10 w-full"></div>
//           </div>
//         ) : (
//           <div className="flex gap-2 mt-1">
//             <div className="w-1/3">
//               <SelectField
//                 name="countryCode"
//                 value={selectedCountry}
//                 onChange={handleCountryChange}
//                 options={countryOptions}
//                 className="h-full"
//               />
//             </div>
//             <div className="w-2/3">
//               <div className="w-2/3">
//                 <InputField
//                   name="phoneNumber"
//                   type="tel"
//                   value={phoneDigits}
//                   onChange={handlePhoneChange}
//                   onBlur={() => setPhoneTouched(true)}
//                   placeholder="1234567890"
//                   icon={<PhoneIcon className="h-5 w-5 text-gray-400" />}
//                   error={phoneTouched ? errors.phone?.message : undefined}
//                 />
//               </div>
//             </div>
//           </div>
//         )}
//         {phoneTouched && errors.phone && (
//           <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default ContactInformation;
