import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { selectCurrentRoom } from "../../../stores/Slices/roomSlice";
import RoomBookingCard from "../../features/RoomBookingCard/RoomBookingCard";
import { Button } from "../../../components/Ui";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useGuestBooking } from "../../../hooks/RoomBoookingApiHooks/useCreateGuestBooking";
import { calculateTotalPrice } from "../../../utils/calculateTotalPrice";
import { ErrorMessage, SuccessMessage } from "../../../components/Ui";

function RoomBookingForms() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const currentRoom = useSelector(selectCurrentRoom);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const { mutate: createBooking } = useGuestBooking();

  // Auto-dismiss messages after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (errorMessage) setErrorMessage(null);
      if (successMessage) setSuccessMessage(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage, successMessage]);

  const handleBack = () => navigate(-1);

  const clearMessages = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleBookRoom = async (bookingDetails) => {
    setIsLoading(true);
    clearMessages();

    try {
      // Validate room data exists
      if (!currentRoom?._id || !currentRoom?.host || !currentRoom?.service) {
        throw new Error("Room information is incomplete");
      }

      // Prepare complete booking data
      const completeBookingData = {
        ...bookingDetails,
        host: currentRoom.host,
        service: currentRoom.service,
        room: currentRoom._id,
        totalPrice: calculateTotalPrice(
          currentRoom.pricePerNight,
          bookingDetails.checkInDate,
          bookingDetails.checkOutDate
        ),
      };

      createBooking(completeBookingData, {
        onSuccess: (booking) => {
          setSuccessMessage(
            "Booking created successfully! Redirecting to payment..."
          );
          setTimeout(() => {
            navigate(`/payment/${booking._id}`, {
              state: {
                booking: {
                  ...booking,
                  guestEmail: booking.guestInfo.email, // Add this line
                },
                room: currentRoom,
                totalPrice: completeBookingData.totalPrice,
              },
            });
          }, 1500);
        },
        onError: (error) => {
          // Extract more specific error message if available
          const errorMsg =
            error.response?.data?.message ||
            error.message ||
            "Failed to create booking. Please try again.";
          setErrorMessage(errorMsg);
        },
        onSettled: () => {
          setIsLoading(false);
        },
      });
    } catch (error) {
      console.error("Booking error:", error);
      setErrorMessage(error.message || "An unexpected error occurred");
      setIsLoading(false);
    }
  };

  if (!currentRoom) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500 mb-4">Loading room information...</p>
        <Button onClick={handleBack} icon={ArrowLeftIcon} iconPosition="left">
          Back
        </Button>
      </div>
    );
  }

  if (!currentRoom.host || !currentRoom.service) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500 mb-4">Incomplete room data</p>
        <p className="text-sm text-gray-500 mb-4">
          Missing: {!currentRoom.host && "Host ID"}{" "}
          {!currentRoom.service && "Service ID"}
        </p>
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

      {errorMessage && (
        <ErrorMessage
          message={errorMessage}
          onDismiss={() => setErrorMessage(null)}
        />
      )}

      {successMessage && (
        <SuccessMessage
          message={successMessage}
          onDismiss={() => setSuccessMessage(null)}
        />
      )}

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
