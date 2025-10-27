import { authRepo } from "@src/repositories/authRepo";
import { LoginReq, RegisterReq } from "@src/types/auth";
import { UserForm } from "@src/types/user";

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

  // Get info
  getInfo: async () => {
    return await authRepo.getInfo();
  },

  // Update info
  updateInfo: async (userId: string, data: UserForm) => {
    return await authRepo.updateInfo(userId, data);
  },
};
