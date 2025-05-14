import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { resendVerificationEmail } from "../../services/users.api";
import { toast } from "react-toastify";
import {
  EnvelopeIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import {
  ErrorMessage as ErrorMessageComponent,
  SuccessMessage,
} from "../../components/Ui/Message/AlertMessage";

const ResendVerifyEmail = () => {
  const { state } = useLocation(); // Get the state from navigation
  const emailFromLogin = state?.email || "";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError: setFormError,
    clearErrors,
    setValue,
  } = useForm({
    defaultValues: {
      email: emailFromLogin, // Pre-fill with email from login if available
    },
  });

  const [success, setSuccess] = React.useState("");
  const navigate = useNavigate();

  // Set the email value if coming from login
  useEffect(() => {
    if (emailFromLogin) {
      setValue("email", emailFromLogin);
    }
  }, [emailFromLogin, setValue]);

  const onSubmit = async (data) => {
    try {
      const result = await resendVerificationEmail(data.email);
      if (result.success) {
        setSuccess("Verification email sent successfully!");
        toast.success("Verification email sent successfully!");
        reset();
        setTimeout(() => navigate("/login"), 3000);
      }
    } catch (error) {
      setFormError("root", {
        type: "manual",
        message: error.message,
      });
      toast.error(error.message);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  const dismissError = () => {
    clearErrors("root");
  };

  const dismissSuccess = () => {
    setSuccess("");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        <div className="text-center mb-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            {errors.root ? (
              <ExclamationCircleIcon className="h-6 w-6 text-red-600" />
            ) : success ? (
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            ) : (
              <EnvelopeIcon className="h-6 w-6 text-blue-600" />
            )}
          </div>
          <h2 className="mt-3 text-2xl font-bold text-gray-900">
            {success ? "Email Sent!" : "Resend Verification Email"}
          </h2>
          <p className="mt-2 text-gray-600">
            {success
              ? "Please check your inbox for the verification link."
              : "Enter your email to receive a new verification link."}
          </p>
        </div>

        {errors.root && (
          <ErrorMessageComponent
            message={errors.root.message}
            onDismiss={dismissError}
            className="mb-4"
          />
        )}

        {success ? (
          <SuccessMessage
            message={success}
            onDismiss={dismissSuccess}
            className="mb-4"
          />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={`block w-full rounded-md shadow-sm focus:border-rose-500 focus:ring-rose-500 p-2 border ${
                    errors.email ? "border-red-300" : "border-gray-300"
                  } transition-colors`}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: "Please enter a valid email address",
                    },
                  })}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center items-center rounded-md border border-transparent px-4 py-2 shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                  isSubmitting
                    ? "bg-rose-400 hover:bg-rose-400 focus:ring-rose-400"
                    : "bg-rose-600 hover:bg-rose-700 focus:ring-rose-500"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Resend Verification Email"
                )}
              </button>
            </div>

            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={handleBackToLogin}
                className="text-sm font-medium text-rose-600 hover:text-rose-500 transition-colors"
              >
                Back to Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResendVerifyEmail;
