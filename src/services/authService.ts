import { authRepo } from "@src/repositories/authRepo";
import { LoginReq, RegisterReq } from "@src/types/auth";

export const authService = {
  // Register
  register: async (data: RegisterReq) => {
    return await authRepo.register(data);
  },

  // Login
  login: async (data: LoginReq) => {
    return await authRepo.login(data);
  },

  // Refresh
  refresh: async (data: string) => {
    return await authRepo.refresh(data);
  },
};
