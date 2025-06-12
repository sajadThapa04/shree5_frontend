import React from "react";
import { useParams, useLocation } from "react-router-dom";
import RoomPaymentCard from "../../components/forms/RoomPaymentForms/RoomPaymentForms"
import { ErrorMessage } from "../../components/Ui";

function GuestRoomPayment() {
  const { bookingId } = useParams();
  const location = useLocation();
  const { booking } = location.state || {};

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

  return (
    <RoomPaymentCard
      bookingId={bookingId}
      amount={booking.totalPrice}
      email={booking.guestInfo.email}
      booking={booking} // Pass the entire booking object
    />
  );
}

export default GuestRoomPayment;
