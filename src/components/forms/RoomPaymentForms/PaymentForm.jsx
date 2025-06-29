import React, { useState, useEffect } from "react";
import {
  Elements,
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useGuestPayment } from "../../../hooks/RoomPaymentsApiHooks/useCreateGuestRoomPayments";
import { Button, ErrorMessage, LoadingSpinner } from "../../Ui";
import { motion, AnimatePresence } from "framer-motion";
import { countries } from "countries-list"; // Import from countries-list package
import conf from "../../../conf/conf";

const stripePromise = loadStripe(conf.stripe_api);

// Convert countries object to array and sort alphabetically
const COUNTRIES_LIST = Object.entries(countries)
  .map(([code, country]) => ({
    code,
    name: country.name,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

const PaymentForm = ({ bookingId, amount, email, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { createPayment, confirmPayment, isLoading, isError, error } =
    useGuestPayment();

  const [paymentError, setPaymentError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [emailInput, setEmailInput] = useState(email || "");
  const [country, setCountry] = useState("US");
  const [cardComplete, setCardComplete] = useState({
    cardNumber: false,
    cardExpiry: false,
    cardCvc: false,
  });

  const isCardComplete = Object.values(cardComplete).every(Boolean);

  useEffect(() => {
    if (isError) {
      setPaymentError(error?.message || "Payment failed");
      setIsProcessing(false);
    }
  }, [isError, error]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setPaymentError("");

    try {
      const { error: stripeError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: "card",
          card: elements.getElement(CardNumberElement),
          billing_details: {
            email: emailInput,
            address: { country },
          },
        });

      if (stripeError) throw new Error(stripeError.message);

      const creationResult = await createPayment({
        booking: bookingId,
        amount,
        email: emailInput,
        paymentMethod: "stripe",
        paymentMethodId: paymentMethod.id,
        paymentMetadata: {
          description: `Payment for booking ${bookingId}`,
        },
      });

      if (!creationResult.data?.transactionId) {
        throw new Error("Payment initialization failed");
      }

      const confirmationResult = await confirmPayment({
        paymentIntentId: creationResult.data.transactionId,
        paymentMethodId: paymentMethod.id,
        email: emailInput,
      });

      if (confirmationResult.data?.paymentStatus !== "succeeded") {
        throw new Error("Payment not completed");
      }

      onSuccess();
    } catch (err) {
      console.error("Payment error:", err);
      setPaymentError(err.message || "Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCardFieldChange = (field) => (event) => {
    setCardComplete((prev) => ({
      ...prev,
      [field]: event.complete,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email Input */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email address
        </label>
        <input
          type="email"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          placeholder="your@email.com"
          required
        />
      </motion.div>

      {/* Country Selection */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Country
        </label>
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        >
          {COUNTRIES_LIST.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
      </motion.div>

      {/* Card Details */}
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <label className="block text-sm font-medium text-gray-700">
          Card details
        </label>

        {/* Card Number */}
        <div className="border border-gray-300 rounded-md p-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition">
          <CardNumberElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                  iconColor: "#666EE8",
                },
                invalid: {
                  color: "#9e2146",
                },
              },
              showIcon: true,
              placeholder: "1234 1234 1234 1234",
            }}
            onChange={handleCardFieldChange("cardNumber")}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Expiry Date */}
          <div className="border border-gray-300 rounded-md p-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition">
            <CardExpiryElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#424770",
                    "::placeholder": {
                      color: "#aab7c4",
                    },
                  },
                  invalid: {
                    color: "#9e2146",
                  },
                },
                placeholder: "MM/YY",
              }}
              onChange={handleCardFieldChange("cardExpiry")}
            />
          </div>

          {/* CVC */}
          <div className="border border-gray-300 rounded-md p-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition">
            <CardCvcElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#424770",
                    "::placeholder": {
                      color: "#aab7c4",
                    },
                  },
                  invalid: {
                    color: "#9e2146",
                  },
                },
                placeholder: "CVC",
              }}
              onChange={handleCardFieldChange("cardCvc")}
            />
          </div>
        </div>
      </motion.div>

      {/* Error Messages */}
      <AnimatePresence>
        {paymentError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="text-red-500 text-sm py-2">{paymentError}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Button
          type="submit"
          disabled={!stripe || isProcessing || !isCardComplete || isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition duration-150 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          {isProcessing || isLoading ? (
            <span className="flex items-center justify-center">
              <LoadingSpinner className="mr-2" /> Processing Payment...
            </span>
          ) : (
            `Pay $${amount}`
          )}
        </Button>
      </motion.div>
    </form>
  );
};

export default PaymentForm;
