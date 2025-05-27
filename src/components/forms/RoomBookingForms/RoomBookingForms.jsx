import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { selectCurrentRoom } from "../../../stores/Slices/roomSlice";
import RoomBookingCard from "../../features/RoomBookingCard/RoomBookingCard";
import { Button } from "../../../components/Ui";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useGuestBooking } from "../../../hooks/RoomBoookingApiHooks/useCreateGuestBooking";

function RoomBookingForms() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const currentRoom = useSelector(selectCurrentRoom);
  const [isLoading, setIsLoading] = useState(false);
  const { mutate: createBooking } = useGuestBooking();

  const handleBack = () => navigate(-1);

  const handleBookRoom = async (bookingDetails) => {
    setIsLoading(true);
    try {
      createBooking(bookingDetails, {
        onSuccess: (response) => {
          // Redirect to payment page with booking ID
          navigate(`/payment/${response.data._id}`, {
            state: {
              booking: response.data,
              room: currentRoom,
              totalPrice: calculateTotalPrice(
                currentRoom.pricePerNight,
                bookingDetails.checkInDate,
                bookingDetails.checkOutDate
              ),
            },
          });
        },
        onError: (error) => {
          console.error("Booking failed:", error);
          // Handle error (show toast, etc.)
        },
        onSettled: () => {
          setIsLoading(false);
        },
      });
    } catch (error) {
      console.error("Booking failed:", error);
      setIsLoading(false);
    }
  };

  if (!currentRoom) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500 mb-4">Room information not available</p>
        <Button onClick={handleBack} icon={ArrowLeftIcon} iconPosition="left">
          Back to Room
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto p-4 md:p-6"
    >
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={handleBack}
          icon={ArrowLeftIcon}
          iconPosition="left"
        >
          Back to Room
        </Button>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Book {currentRoom.name}
      </h1>

      <RoomBookingCard
        room={currentRoom}
        onBook={handleBookRoom}
        isLoading={isLoading}
        isGuest={true}
      />
    </motion.div>
  );
}

export default RoomBookingForms;
