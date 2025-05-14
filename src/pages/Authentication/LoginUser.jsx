import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { loginUsers, clearError } from "../../stores/Slices/userSlices";
import LoginForm from "../../components/forms/LoginForm";
import { motion } from "framer-motion";
import {
  ErrorMessage,
  SuccessMessage,
} from "../../components/Ui/Message/AlertMessage";

const LoginUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [formError, setFormError] = useState(null);

  // Get state from Redux store
  const { loading, error, isAuthenticated, userInfo } = useSelector(
    (state) => state.user
  );

  // Handle login state changes
  useEffect(() => {
    if (isAuthenticated && userInfo) {
      // if (!isEmailVerified) {
      //   navigate("/resend-verification", { state: { email: userInfo.email } });
      //   return;
      // }

      // Success flow for verified users
      setShowSuccess(true);
      const timer = setTimeout(() => navigate("/"), 2000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, userInfo, navigate]);

  // Show error message when error occurs
  useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => {
        setShowError(false);
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleSubmit = async (data) => {
    try {
      // Reset states
      setShowError(false);
      setFormError(null);
      dispatch(clearError());

      // Basic client-side validation
      if (!data.email || !data.password) {
        setFormError("Email and password are required");
        return;
      }

      // Dispatch login action
      await dispatch(loginUsers(data)).unwrap();
    } catch (err) {
      // The error is already handled by Redux and will be available in the error state
      // No need to set it here as it will trigger the error useEffect
      console.error("Login error:", err);
    }
  };

  const handleDismissError = () => {
    setShowError(false);
    dispatch(clearError());
  };

  const handleDismissSuccess = () => {
    setShowSuccess(false);
    navigate("/");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex-grow flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md space-y-4"
      >
        {/* Success Message */}
        {showSuccess && (
          <SuccessMessage
            message="You have been logged in successfully! Redirecting..."
            onDismiss={handleDismissSuccess}
          />
        )}

        {/* API Error Message */}
        {showError && error?.message && (
          <ErrorMessage
            message={error.message}
            onDismiss={handleDismissError}
          />
        )}

        {/* Form Validation Error */}
        {formError && (
          <ErrorMessage
            message={formError}
            onDismiss={() => setFormError(null)}
          />
        )}

        {/* Login Form */}
        <LoginForm
          onSubmit={handleSubmit}
          isLoading={loading}
          error={formError}
        />
      </motion.div>
    </motion.div>
  );
};

export { LoginUser };
