import {useState} from "react";
import {updateHostProfile} from "../../services/host.api";

export const useUpdateHost = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const updateHost = async (hostId, updateData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await updateHostProfile(hostId, updateData);
      setData(result.data);
      return result;
    } catch (err) {
      setError(err.message || "Failed to update host profile");
      throw err; // Re-throw to allow handling in component
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateHost,
    isLoading,
    error,
    data,
    reset: () => {
      setError(null);
      setData(null);
    }
  };
};