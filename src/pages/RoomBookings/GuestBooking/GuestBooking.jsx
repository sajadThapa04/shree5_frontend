import React from "react";
import { useParams } from "react-router-dom";
import RoomBookingForms from "../../../components/forms/RoomBookingForms/RoomBookingForms";
function GuestBooking() {
  const { roomId } = useParams();

  return (
    <div>
      <RoomBookingForms />
    </div>
  );
}

export default GuestBooking;
