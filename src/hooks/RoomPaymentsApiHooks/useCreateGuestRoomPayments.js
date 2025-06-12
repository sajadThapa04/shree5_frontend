import {useMutation, useQueryClient} from "@tanstack/react-query";
import {createGuestPayment, confirmGuestPayment} from "../../services/roomPayment.api";

export const useGuestPayment = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async ({
      booking,
      amount,
      email,
      paymentMethod,
      paymentMethodId,
      paymentMetadata
    }) => {
      const response = await createGuestPayment({
        booking,
        amount,
        email,
        paymentMethod,
        paymentMethodId, // Critical addition
        paymentMetadata
      });

      // Verify the payment was actually created successfully
      if (
        !response.data
        ?.transactionId) {
        throw new Error("Payment initialization failed");
      }
      return response;
    },
    onError: error => {
      console.error("Payment creation error:", error.message);
      throw error;
    }
  });

  const confirmMutation = useMutation({
    mutationFn: async ({paymentIntentId, paymentMethodId, email}) => {
      const response = await confirmGuestPayment({paymentIntentId, paymentMethodId, email});

      // Verify the payment was actually confirmed
      if (
        response.data
        ?.paymentStatus !== "succeeded") {
        throw new Error("Payment confirmation failed");
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["payments"]);
      queryClient.invalidateQueries(["bookings"]);
    },
    onError: error => {
      console.error("Payment confirmation error:", error.message);
      throw error;
    }
  });

  return {
    createPayment: createMutation.mutateAsync,
    confirmPayment: confirmMutation.mutateAsync,
    isLoading: createMutation.isLoading || confirmMutation.isLoading,
    isSuccess: confirmMutation.isSuccess,
    isError: createMutation.isError || confirmMutation.isError,
    error: createMutation.error || confirmMutation.error,
    requiresConfirmation: createMutation.data
      ?.data
        ?.requiresConfirmation,
    paymentData: createMutation.data
      ?.data
  };
};