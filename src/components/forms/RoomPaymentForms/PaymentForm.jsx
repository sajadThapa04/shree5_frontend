import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useGuestPayment } from "../../../hooks/RoomPaymentsApiHooks/useCreateGuestRoomPayments";
import { Button, ErrorMessage, LoadingSpinner } from "../../Ui";

const PaymentForm = ({ bookingId, amount, email, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const {
    createPayment,
    confirmPayment,
    isLoading,
    isError,
    error,
    requiresConfirmation,
  } = useGuestPayment();

  const [paymentError, setPaymentError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isError) {
      setPaymentError(error?.message || "Payment failed");
      setIsProcessing(false);
    }
  }, [isError, error]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsProcessing(true);
    setPaymentError("");

    try {
      // 1. Create Payment Method with Stripe
      const { error: stripeError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: "card",
          card: elements.getElement(CardElement),
          billing_details: { email },
        });

      if (stripeError) throw new Error(stripeError.message);

      // 2. Create Payment in our backend
      const creationResult = await createPayment({
        booking: bookingId,
        amount,
        email,
        paymentMethod: "stripe",
        paymentMethodId: paymentMethod.id, // Critical!
        paymentMetadata: {
          description: `Payment for booking ${bookingId}`,
        },
      });

      // 3. Verify payment was properly initialized
      if (!creationResult.data?.transactionId) {
        throw new Error("Payment initialization failed");
      }

      // 4. Confirm the payment
      const confirmationResult = await confirmPayment({
        paymentIntentId: creationResult.data.transactionId,
        paymentMethodId: paymentMethod.id,
        email,
      });

      // 5. Verify final status
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-md mb-4">
        <h3 className="font-medium">Booking Reference: {bookingId}</h3>
        <p className="text-sm text-gray-600">Amount: ${amount}</p>
        <p className="text-sm text-gray-600">Email: {email}</p>
      </div>

      <div className="border rounded-md p-3">
        <CardElement
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
          }}
          onChange={(e) => {
            if (e.error) {
              setPaymentError(e.error.message);
            } else {
              setPaymentError("");
            }
          }}
        />
      </div>

      {paymentError && (
        <ErrorMessage
          message={paymentError}
          onDismiss={() => setPaymentError("")}
        />
      )}

      <Button
        type="submit"
        disabled={!stripe || isProcessing || isLoading}
        className="w-full"
      >
        {isProcessing || isLoading ? (
          <>
            <LoadingSpinner size="sm" className="mr-2" />
            Processing...
          </>
        ) : (
          `Pay $${amount} now`
        )}
      </Button>
    </form>
  );
};

export default PaymentForm;
