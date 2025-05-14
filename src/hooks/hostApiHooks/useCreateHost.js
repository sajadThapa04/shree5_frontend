import {useMutation, useQueryClient} from "@tanstack/react-query";
import {createHostProfile} from "../../services/host.api";

// Create query keys for host-related queries
export const hostKeys = {
  all: ["hosts"],
  lists: () => [
    ...hostKeys.all,
    "list"
  ]
};

/**
 * Custom React Query hook for creating a host profile
 * @returns {Object} Mutation object with properties and methods for creating a host
 *
 * @example
 * // Basic usage
 * const { mutate: createHost, isLoading, isError, error, isSuccess } = useCreateHost();
 *
 * // With callbacks
 * createHost(hostData, {
 *   onSuccess: (data) => console.log('Host created:', data),
 *   onError: (error) => console.error('Error:', error)
 * });
 */
export const useCreateHost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createHostProfile,
    onSuccess: data => {
      // Invalidate the hosts list to refetch after successful creation
      queryClient.invalidateQueries({queryKey: hostKeys.lists()});
      return data;
    },
    onError: error => {
      // Error is already handled in createHostProfile, but we can add additional handling
      console.error("Host creation error:", error.message);
    },
    onMutate: async newHost => {
      // Optimistic update: update cache before request completes
      await queryClient.cancelQueries({queryKey: hostKeys.lists()});

      const previousHosts = queryClient.getQueryData(hostKeys.lists());

      // Add new host to cache optimistically
      queryClient.setQueryData(hostKeys.lists(), old => {
        return old
          ? [
            ...old, {
              ...newHost,
              id: Date.now().toString()
            }
          ]
          : [
            {
              ...newHost,
              id: Date.now().toString()
            }
          ];
      });

      return {previousHosts};
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({queryKey: hostKeys.lists()});
    }
  });
};