import {useMutation} from "@tanstack/react-query";
import {createGuestBooking} from "../../services/roomBooking.api";

export const useGuestBooking = () => {
  return useMutation({
    mutationFn: async bookingData => {
      const response = await createGuestBooking(bookingData);
      if (!response.success) {
        throw new Error(response.error || "Failed to create guest booking");
      }
      return response;
    },
    onSuccess: data => {
      console.log("Guest booking created successfully", data);
    },
    onError: error => {
      console.error("Failed to create guest booking", error.message);
    }
  });
};