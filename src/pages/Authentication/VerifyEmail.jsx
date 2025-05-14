import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ResendVerifyEmail from "./ResendVerifyEmail";

import {
  verifyUserEmail,
  markEmailVerified,
} from "../../stores/Slices/userSlices";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get relevant state from Redux store
  const { loading, error, isEmailVerified, isRefreshingToken } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      dispatch(markEmailVerified()); // Mark as not verified
      return;
    }

    // Only dispatch if not already verified and not currently loading
    if (!isEmailVerified && !loading && !isRefreshingToken) {
      dispatch(verifyUserEmail(token))
        .unwrap()
        .then(() => {
          toast.success("Email verified successfully!");
          setTimeout(() => navigate("/login"), 3000);
        })
        .catch((error) => {
          // Handle "already verified" case specifically
          if (error.message.toLowerCase().includes("already verified")) {
            dispatch(markEmailVerified());
            toast.success("Your email was already verified!");
            setTimeout(() => navigate("/login"), 3000);
          } else {
            toast.error(error.message || "Email verification failed");
          }
        });
    }
  }, [
    searchParams,
    dispatch,
    navigate,
    isEmailVerified,
    loading,
    isRefreshingToken,
  ]);

  // Determine status based on Redux state
  const status = !searchParams.get("token")
    ? "invalid"
    : loading
    ? "verifying"
    : isEmailVerified
    ? "verified"
    : error
    ? "failed"
    : "verifying";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8 text-center">
        {status === "verifying" && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <ArrowPathIcon className="h-12 w-12 text-blue-500 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Verifying Your Email
            </h2>
            <p className="text-gray-600">
              Please wait while we verify your email address.
            </p>
          </div>
        )}

        {status === "verified" && (
          <div className="space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircleIcon className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Email Verified Successfully!
            </h2>
            <p className="text-gray-600">
              You will be redirected to the login page shortly.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="mt-4 w-full rounded-md bg-rose-600 px-4 py-2 text-white hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
            >
              Go to Login
            </button>
          </div>
        )}

        {status === "failed" && (
          <div className="space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <ExclamationTriangleIcon className="h-10 w-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Verification Failed
            </h2>
            <p className="text-gray-600">
              {error?.message || "Invalid verification link"}
            </p>
            <div className="flex flex-col space-y-3 mt-4">
              <button
                onClick={() => navigate("/register")}
                className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
              >
                Back to Registration
              </button>
              <button
                onClick={() => navigate("/resend-verification")}
                className="rounded-md bg-rose-600 px-4 py-2 text-white hover:bg-rose-700"
              >
                Resend Verification Email
              </button>
            </div>
          </div>
        )}

        {status === "invalid" && (
          <div className="space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <ExclamationTriangleIcon className="h-10 w-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Invalid Verification Link
            </h2>
            <p className="text-gray-600">
              The verification link is missing a token.
            </p>
            <button
              onClick={() => navigate("/register")}
              className="mt-4 w-full rounded-md bg-rose-600 px-4 py-2 text-white hover:bg-rose-700"
            >
              Back to Registration
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
