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
import { PaymentRequestButtonElement } from "@stripe/react-stripe-js";
import conf from "../../../conf/conf";
import { format } from "date-fns";
import { Button, LoadingSpinner } from "../../Ui";
import { motion, AnimatePresence } from "framer-motion";

const stripePromise = loadStripe(conf.stripe_api);

const countries = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "AU", name: "Australia" },
  // Add more countries as needed
];

const PaymentForm = ({
  bookingId,
  amount,
  email,
  bookingDetails,
  onSuccess,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emailInput, setEmailInput] = useState(email || "");
  const [country, setCountry] = useState("US");
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [cardComplete, setCardComplete] = useState({
    cardNumber: false,
    cardExpiry: false,
    cardCvc: false,
  });

  // Check if all card fields are complete
  const isCardComplete = Object.values(cardComplete).every(Boolean);

  // Initialize payment request for Apple/Google Pay
  useEffect(() => {
    if (!stripe) return;

    const pr = stripe.paymentRequest({
      country: country,
      currency: "usd",
      total: {
        label: "Total",
        amount: Math.round(amount * 100),
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    pr.canMakePayment().then((result) => {
      if (result) {
        setPaymentRequest(pr);
      }
    });

    pr.on("paymentmethod", async (ev) => {
      setLoading(true);
      try {
        // Simulate payment processing
        setTimeout(() => {
          onSuccess();
          ev.complete("success");
          setLoading(false);
        }, 1500);
      } catch (err) {
        ev.complete("fail");
        setError(err.message);
        setLoading(false);
      }
    });
  }, [stripe, amount, country]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    if (!emailInput) {
      setError("Please enter your email");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: stripeError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: "card",
          card: elements.getElement(CardNumberElement),
          billing_details: {
            email: emailInput,
            address: {
              country: country,
            },
          },
        });

      if (stripeError) {
        setError(stripeError.message);
        setLoading(false);
        return;
      }

      // Simulate payment processing
      setTimeout(() => {
        onSuccess();
        setLoading(false);
      }, 1500);
    } catch (err) {
      setError(err.message);
      setLoading(false);
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
      {/* Email Input with animation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email address
        </label>
        <input
          type="email"
          id="email"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          placeholder="your@email.com"
          required
        />
      </motion.div>

      {/* Country Selection */}
      <div>
        <label
          htmlFor="country"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Country
        </label>
        <select
          id="country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          {countries.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
      </div>
      {/* Card Details with separate fields */}
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
            className="w-full"
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
              className="w-full"
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
              className="w-full"
            />
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="text-red-500 text-sm py-2">{error}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Digital Wallets */}
      {paymentRequest && (
        <motion.div
          className="mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="text-xs text-gray-500 mb-2">Pay with:</div>
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <PaymentRequestButtonElement
              options={{
                paymentRequest,
                style: {
                  paymentRequestButton: {
                    type: "default",
                    theme: "dark",
                    height: "44px",
                  },
                },
              }}
            />
          </div>
          <div className="flex items-center justify-center my-4">
            <div className="border-t border-gray-300 flex-grow"></div>
            <span className="px-3 text-sm text-gray-500">or</span>
            <div className="border-t border-gray-300 flex-grow"></div>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Button
          type="submit"
          disabled={!stripe || loading || !isCardComplete}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition duration-150 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          {loading ? (
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

const RoomPaymentCard = ({ bookingId, amount, email, booking }) => {
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  if (paymentSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg mx-auto p-8 bg-white rounded-xl shadow-lg"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100"
          >
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </motion.div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            Payment Successful!
          </h2>
          <p className="mt-2 text-gray-600">
            Your booking has been confirmed. A receipt has been sent to {email}.
          </p>
          <div className="mt-6">
            <motion.button
              onClick={() => (window.location.href = "/")}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Back to Home
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-lg mx-auto p-8 bg-white rounded-xl shadow-lg"
    >
      <div className="mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-gray-900"
        >
          Complete Your Booking
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-gray-600 mt-1"
        >
          Secure payment processed by Stripe
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-200"
      >
        <h2 className="font-semibold text-lg mb-4">Booking Summary</h2>

        <div className="space-y-3">
          {[
            { label: "Booking Reference", value: bookingId },
            {
              label: "Check-in",
              value: format(new Date(booking.checkInDate), "MMM dd, yyyy"),
            },
            {
              label: "Check-out",
              value: format(new Date(booking.checkOutDate), "MMM dd, yyyy"),
            },
            {
              label: "Nights",
              value: `${Math.ceil(
                (new Date(booking.checkOutDate) -
                  new Date(booking.checkInDate)) /
                  (1000 * 60 * 60 * 24)
              )} nights`,
            },
            { label: "Room Type", value: booking.roomType },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              className="flex justify-between"
            >
              <span className="text-gray-600">{item.label}:</span>
              <span className="font-medium text-gray-900">{item.value}</span>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-between pt-3 border-t border-gray-200"
          >
            <span className="text-gray-600">Total Amount:</span>
            <span className="font-bold text-lg text-gray-900">${amount}</span>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <h2 className="font-semibold text-lg mb-4">Payment Details</h2>

        <Elements stripe={stripePromise}>
          <PaymentForm
            bookingId={bookingId}
            amount={amount}
            email={email}
            bookingDetails={booking}
            onSuccess={() => setPaymentSuccess(true)}
          />
        </Elements>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex items-center text-sm text-gray-500"
      >
        <svg
          className="h-5 w-5 text-gray-400 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        Payments are secure and encrypted with 256-bit SSL encryption
      </motion.div>
    </motion.div>
  );
};

export default RoomPaymentCard;
