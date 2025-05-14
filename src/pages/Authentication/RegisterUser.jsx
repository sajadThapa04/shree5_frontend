import { useRegisterUser } from "../../hooks/userApiHooks/useRegisterUser";
import RegisterForm from "../../components/forms/RegisterForm";
import { motion } from "framer-motion";
import {
  ErrorMessage,
  SuccessMessage,
} from "../../components/Ui/Message/AlertMessage";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterUser = () => {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState(null);
  const {
    mutate: register,
    isPending,
    isError,
    error,
    isSuccess,
  } = useRegisterUser({
    onSuccess: (data) => {
      // Use the message from backend or fallback
      const message =
        data?.message ||
        "Your account has been created successfully! Please check your email to verify your account.";
      setSuccessMessage(message);

      // Redirect after showing success message
      setTimeout(() => {
        navigate("/login", {
          state: {
            registrationSuccess: true,
            message: message,
          },
        });
      }, 3000);
    },
    onError: () => {
      setSuccessMessage(null);
    },
  });

  const handleSubmit = (data) => {
    register({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      password: data.password,
    });
  };

  const handleDismissSuccess = () => {
    navigate("/login", {
      state: {
        registrationSuccess: true,
        message: successMessage,
      },
    });
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
        {isSuccess && successMessage && (
          <SuccessMessage
            message={successMessage}
            onDismiss={handleDismissSuccess}
          />
        )}

        {/* Error Message */}
        {isError && <ErrorMessage message={error?.message} />}

        <RegisterForm onSubmit={handleSubmit} isLoading={isPending} />
      </motion.div>
    </motion.div>
  );
};

export default RegisterUser;
