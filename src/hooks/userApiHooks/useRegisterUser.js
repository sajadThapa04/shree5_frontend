// src/hooks/useRegisterUser.js
import {useMutation} from "@tanstack/react-query";
import {registerUser} from "../../services/users.api";

export const useRegisterUser = (options = {}) => {
  return useMutation({
    mutationFn: registerUser,
    ...options
  });
};