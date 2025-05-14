import {useMutation, useQueryClient} from "@tanstack/react-query";
import {createService} from "../../services/services.api";

// Create query keys for service-related queries
export const serviceKeys = {
  all: ["services"],
  lists: () => [
    ...serviceKeys.all,
    "list"
  ],
  details: () => [
    ...serviceKeys.all,
    "detail"
  ]
};

/**
 * Custom React Query hook for creating a service
 * @returns {Object} Mutation object with properties and methods for creating a service
 *
 * @example
 * // Basic usage
 * const { mutate: createService, isLoading, isError, error, isSuccess } = useCreateService();
 *
 * // With callbacks
 * createService(serviceData, {
 *   onSuccess: (data) => console.log('Service created:', data),
 *   onError: (error) => console.error('Error:', error)
 * });
 */
export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createService,
    onSuccess: data => {
      // Invalidate the services list to refetch after successful creation
      queryClient.invalidateQueries({queryKey: serviceKeys.lists()});
      return data;
    },
    onError: error => {
      // Error is already handled in createService, but we can add additional handling
      console.error("Service creation error:", error.message);
    },
    onMutate: async newService => {
      // Optimistic update: update cache before request completes
      await queryClient.cancelQueries({queryKey: serviceKeys.lists()});

      const previousServices = queryClient.getQueryData(serviceKeys.lists());

      // Add new service to cache optimistically
      queryClient.setQueryData(serviceKeys.lists(), old => {
        return old
          ? [
            ...old, {
              ...newService,
              id: Date.now().toString() // Temporary ID for optimistic update
            }
          ]
          : [
            {
              ...newService,
              id: Date.now().toString()
            }
          ];
      });

      return {previousServices};
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({queryKey: serviceKeys.lists()});
    }
  });
};