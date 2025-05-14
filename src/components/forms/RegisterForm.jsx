import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  EyeIcon,
  EyeSlashIcon,
  PhoneIcon,
  ArrowPathIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import {
  FormButton,
  InputField,
  CheckboxField,
  SelectField,
} from "../Ui/form/index";
import { motion } from "framer-motion";

// Country data with flags only
const countryOptions = [
  { value: "AU", label: "🇦🇺 +61", code: "+61" },
  { value: "IN", label: "🇮🇳 +91", code: "+91" },
  { value: "SG", label: "🇸🇬 +65", code: "+65" },
  { value: "NP", label: "🇳🇵 +977", code: "+977" },
  { value: "US", label: "🇺🇸 +1", code: "+1" },
  { value: "GB", label: "🇬🇧 +44", code: "+44" },
  { value: "CA", label: "🇨🇦 +1", code: "+1" },
];

const RegisterForm = ({ onSubmit, isLoading, error }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("NP");
  const [phoneDigits, setPhoneDigits] = useState("");

  // Set default country based on user's IP
  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        const userCountry = data.country_code;
        if (countryOptions.some((c) => c.value === userCountry)) {
          setSelectedCountry(userCountry);
        }
      })
      .catch(() => {
        console.log("Using fallback country (NP)");
      });
  }, []);

  const {
    register: formRegister,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
    },
  });

  const password = watch("password");

  // Handle phone number changes
  const handlePhoneChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "");
    setPhoneDigits(digits);
    const country = countryOptions.find((c) => c.value === selectedCountry);
    setValue("phone", `${country.code}${digits}`, { shouldValidate: true });
  };

  // Handle country selection changes
  const handleCountryChange = (e) => {
    const countryValue = e.target.value;
    setSelectedCountry(countryValue);
    const country = countryOptions.find((c) => c.value === countryValue);
    setValue("phone", `${country.code}${phoneDigits}`, {
      shouldValidate: true,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-md">
      <div className="p-8">
        <motion.h2
          className="text-2xl font-bold text-center text-gray-800 mb-6"
          initial={{ y: -10 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.2 }}
        >
          Create Your Account
        </motion.h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name Field */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <InputField
              label="Full Name"
              name="fullName"
              placeholder="shree5"
              icon={<UserIcon className="h-5 w-5 text-gray-400" />}
              error={errors.fullName?.message}
              {...formRegister("fullName", {
                required: "Full name is required",
                minLength: {
                  value: 3,
                  message: "Full name must be at least 3 characters",
                },
              })}
            />
          </motion.div>

          {/* Email Field */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <InputField
              label="Email Address"
              name="email"
              type="email"
              placeholder="shree5@email.com"
              icon={<EnvelopeIcon className="h-5 w-5 text-gray-400" />}
              error={errors.email?.message}
              {...formRegister("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />
          </motion.div>

          {/* Phone Field */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
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
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </motion.div>

          {/* Password Field */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <InputField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              icon={<LockClosedIcon className="h-5 w-5 text-gray-400" />}
              error={errors.password?.message}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              }
              {...formRegister("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                validate: {
                  hasUpper: (value) =>
                    /[A-Z]/.test(value) ||
                    "Must contain at least one uppercase letter",
                  hasLower: (value) =>
                    /[a-z]/.test(value) ||
                    "Must contain at least one lowercase letter",
                  hasNumber: (value) =>
                    /[0-9]/.test(value) || "Must contain at least one number",
                  hasSpecial: (value) =>
                    /[!@#$%^&*(),.?":{}|<>]/.test(value) ||
                    "Must contain at least one special character",
                },
              })}
            />
          </motion.div>

          {/* Confirm Password Field */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <InputField
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              icon={<LockClosedIcon className="h-5 w-5 text-gray-400" />}
              error={errors.confirmPassword?.message}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              }
              {...formRegister("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
            />
          </motion.div>

          {/* Terms Checkbox */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            <CheckboxField
              name="termsAccepted"
              label={
                <span>
                  I agree to the{" "}
                  <a href="#" className="text-rose-600 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-rose-600 hover:underline">
                    Privacy Policy
                  </a>
                </span>
              }
              error={errors.termsAccepted?.message}
              {...formRegister("termsAccepted", {
                required: "You must accept the terms and conditions",
              })}
            />
          </motion.div>

          {/* Server Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 bg-red-50 text-red-600 rounded-md text-sm"
            >
              {error.message}
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="pt-2"
          >
            <FormButton
              type="submit"
              variant="primary"
              className="w-full py-2.5 text-sm font-medium rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-colors flex items-center justify-center gap-2"
              isLoading={isLoading}
            >
              {isLoading ? (
                <>
                  <ArrowPathIcon className="h-4 w-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <UserCircleIcon className="h-4 w-4" />
                  <span>Create Account</span>
                </>
              )}
            </FormButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9 }}
            className="text-center text-sm text-gray-600 pt-4"
          >
            Already have an account?{" "}
            <a href="/login" className="text-rose-600 hover:underline">
              Sign in
            </a>
          </motion.div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
