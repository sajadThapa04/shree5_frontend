import {useMutation} from "@tanstack/react-query";
import {createGuestBooking} from "../../services/roomBooking.api";

export const useGuestBooking = () => {
  return useMutation({
    mutationFn: async bookingData => {
      // Validate required fields before making the API call
      if (!bookingData.host || !bookingData.service || !bookingData.room) {
        throw new Error("Missing required booking information");
      }

      const response = await createGuestBooking(bookingData);

      if (!response.success) {
        throw new Error(response.message || "Failed to create booking");
      }

      return response.data;
    },
    onSuccess: data => {
      console.log("Booking created successfully:", data);
      // You can add toast notification here
    },
    onError: error => {
      console.error("Booking error:", error.message);
      // You can add error toast here
    }
  });
};