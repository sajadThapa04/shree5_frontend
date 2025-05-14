import {useMutation, useQueryClient} from "@tanstack/react-query";
import {updateUserAddress} from "../../services/users.api";
import {toast} from "react-hot-toast";
import {useDispatch} from "react-redux";

export const useUpdateUserAddress = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: updateUserAddress,
    onMutate: async addressData => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({queryKey: ["currentUser"]});

      // Snapshot the previous value
      const previousUser = queryClient.getQueryData(["currentUser"]);

      // Optimistically update the cache
      if (previousUser) {
        queryClient.setQueryData(["currentUser"], old => ({
          ...old,
          address: {
            ...old.address,
            ...addressData
          }
        }));
      }

      return {previousUser};
    },
    onSuccess: data => {
      // Update Redux store with new address
      dispatch({type: "user/updateUserAddress", payload: data.data.address});

      toast.success(data.message || "Address updated successfully");

      // Invalidate and refetch to ensure we have fresh data
      queryClient.invalidateQueries({queryKey: ["currentUser"]});
    },
    onError: (error, variables, context) => {
      // Rollback the optimistic update on error
      if (
        context
        ?.previousUser) {
        queryClient.setQueryData(["currentUser"], context.previousUser);
      }
      toast.error(error.message || "Failed to update address");
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({queryKey: ["currentUser"]});
    }
  });
};