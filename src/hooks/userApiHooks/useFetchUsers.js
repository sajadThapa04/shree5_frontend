import { fetchUserProfile } from "../../services/users.api";
import { useQuery } from "@tanstack/react-query";

export const useUserProfile = (options = {}) => {
  return useQuery({
    queryKey: ["currentUserProfile"],
    queryFn: () => fetchUserProfile(), // No parameters needed
    ...options,
    retry: (failureCount, error) => {
      if (error.message.includes("404") || error.message.includes("401")) {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false
  });
};