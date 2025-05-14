import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowRightStartOnRectangleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { FormButton, InputField } from "../Ui/form";
import { motion } from "framer-motion";

const LoginForm = ({ onSubmit, isLoading, error }) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-md">
      <div className="p-8">
        <motion.h2
          className="text-2xl font-bold text-center text-gray-800 mb-6"
          initial={{ y: -10 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.2 }}
        >
          Welcome Back
        </motion.h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <InputField
              label="Email Address"
              name="email"
              type="email"
              placeholder="shree5@email.com"
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
          </motion.div>

          {/* Password Field */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
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
              {...register("password", {
                required: "Password is required",
              })}
            />
          </motion.div>

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <a href="/forgot-password" className="text-sm text-rose-600">
              Forgot password?
            </a>
          </div>

          {/* Server Error Message */}
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
              {error.message}
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <FormButton
              type="submit"
              variant="primary"
              className="w-full py-2.5 text-sm font-medium rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-colors flex items-center justify-center gap-2"
              isLoading={isLoading}
            >
              {isLoading ? (
                <>
                  <ArrowPathIcon className="h-4 w-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <ArrowRightStartOnRectangleIcon className="h-4 w-4" />
                  <span>Sign in</span>
                </>
              )}
            </FormButton>
          </div>

          <div className="text-center text-sm text-gray-600 pt-4">
            Don't have an account?{" "}
            <a href="/register" className="text-rose-600">
              Sign up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
