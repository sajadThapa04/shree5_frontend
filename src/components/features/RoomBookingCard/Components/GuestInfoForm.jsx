// components/RoomBooking/GuestInfoForm.jsx
import { FiUser, FiMail,  } from "react-icons/fi";
import GuestSelector from "./GuestSelector";
const countryOptions = [
  { value: "AU", label: "🇦🇺 +61", code: "+61" },
  { value: "IN", label: "🇮🇳 +91", code: "+91" },
  { value: "SG", label: "🇸🇬 +65", code: "+65" },
  { value: "NP", label: "🇳🇵 +977", code: "+977" },
  { value: "US", label: "🇺🇸 +1", code: "+1" },
  { value: "GB", label: "🇬🇧 +44", code: "+44" },
  { value: "CA", label: "🇨🇦 +1", code: "+1" },
];

const GuestInfoForm = ({ register, errors, roomCapacity }) => {
  return (
    <div className="space-y-6">
      {/* Guest Selector */}
      <GuestSelector
        register={register}
        errors={errors}
        roomCapacity={roomCapacity}
      />

      {/* Personal Information */}
      <div className="space-y-4 pt-4">
        <h3 className="text-sm font-medium text-gray-700">
          Contact Information
        </h3>

        {/* Full Name Field */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiUser className="h-5 w-5 text-gray-400" />
          </div>
          <input
            {...register("guestInfo.fullName", {
              required: "Full name is required",
            })}
            type="text"
            className="block w-full pl-10 pr-3 py-3 border-b border-gray-300 bg-transparent focus:border-rose-500 focus:outline-none transition-colors"
            placeholder="Full name"
          />
          {errors.guestInfo?.fullName && (
            <p className="mt-1 text-sm text-rose-600">
              {errors.guestInfo.fullName.message}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiMail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            {...register("guestInfo.email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            type="email"
            className="block w-full pl-10 pr-3 py-3 border-b border-gray-300 bg-transparent focus:border-rose-500 focus:outline-none transition-colors"
            placeholder="Email address"
          />
          {errors.guestInfo?.email && (
            <p className="mt-1 text-sm text-rose-600">
              {errors.guestInfo.email.message}
            </p>
          )}
        </div>

        {/* Phone Number with Country Selector */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          </div>
          <div className="flex">
            <select
              {...register("guestInfo.countryCode")}
              className="w-24 pl-6 pr-3 py-3 border-b border-gray-300 bg-transparent focus:border-rose-500 focus:outline-none appearance-none"
            >
              {countryOptions.map((country) => (
                <option key={country.value} value={country.code}>
                  {country.label}
                </option>
              ))}
            </select>
            <input
              {...register("guestInfo.phone", {
                required: "Phone number is required",
              })}
              type="tel"
              className="flex-1 pl-3 pr-3 py-3 border-b border-gray-300 bg-transparent focus:border-rose-500 focus:outline-none transition-colors"
              placeholder="Phone number"
            />
          </div>
          {errors.guestInfo?.phone && (
            <p className="mt-1 text-sm text-rose-600">
              {errors.guestInfo.phone.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuestInfoForm;
