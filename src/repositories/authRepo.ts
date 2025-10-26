import { authApi } from "@src/apis/authApi";
import { LoginReq, RegisterReq } from "@src/types/auth";

export const authRepo = {
  // Register
  register: async (data: RegisterReq) => {
    const res = await authApi.register(data);
    return res;
  },

  // Login
  login: async (data: LoginReq) => {
    const res = await authApi.login(data);
    return res;
  },

  // Refesh
  refresh: async (data: string) => {
    const res = await authApi.refresh(data);
    return res;
  },

  // Get info
  getInfo: async () => {
    const res = await authApi.getInfo();
    return res;
  },
};
