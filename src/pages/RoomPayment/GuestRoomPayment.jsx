import React, { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "../../components/forms/RoomPaymentForms/PaymentForm";
import { ErrorMessage } from "../../components/Ui";
import conf from "../../conf/conf";
const stripePromise = loadStripe(conf.stripe_api);

function GuestRoomPayment() {
  const { bookingId } = useParams();
  const location = useLocation();
  const { booking } = location.state || {};
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  console.log("Booking data from location:", booking);

  if (!bookingId || !booking || !booking?.guestInfo?.email) {
    return (
      <div className="max-w-md mx-auto p-6">
        <ErrorMessage
          message="Missing booking information. Please complete your booking first."
          onDismiss={() => window.history.back()}
        />
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="max-w-lg mx-auto p-8 bg-white rounded-xl shadow-lg text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
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
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Successful!
        </h2>
        <p className="text-gray-600 mb-6">
          Your booking has been confirmed. A receipt has been sent to{" "}
          {booking.guestInfo.email}.
        </p>
        <button
          onClick={() => (window.location.href = "/")}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition shadow-md"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-8 bg-white rounded-xl shadow-lg">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Complete Your Booking
        </h1>
        <p className="text-gray-600 mt-1">Secure payment processed by Stripe</p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-200">
        <h2 className="font-semibold text-lg mb-4">Booking Summary</h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Booking Reference:</span>
            <span className="font-medium text-gray-900">{bookingId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Check-in:</span>
            <span className="font-medium text-gray-900">
              {new Date(booking.checkInDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Check-out:</span>
            <span className="font-medium text-gray-900">
              {new Date(booking.checkOutDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Room Type:</span>
            <span className="font-medium text-gray-900">
              {booking.roomType}
            </span>
          </div>
          <div className="flex justify-between pt-3 border-t border-gray-200">
            <span className="text-gray-600">Total Amount:</span>
            <span className="font-bold text-lg text-gray-900">
              ${booking.totalPrice}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="font-semibold text-lg mb-4">Payment Details</h2>
        <Elements stripe={stripePromise}>
          <PaymentForm
            bookingId={bookingId}
            amount={booking.totalPrice}
            email={booking.guestInfo.email}
            onSuccess={() => setPaymentSuccess(true)}
          />
        </Elements>
      </div>

      <div className="flex items-center text-sm text-gray-500">
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
      </div>
    </div>
  );
}

export default GuestRoomPayment;
