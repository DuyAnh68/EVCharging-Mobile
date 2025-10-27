import { authApi } from "@src/apis/authApi";
import { LoginReq, RegisterReq } from "@src/types/auth";
import { User, UserForm } from "@src/types/user";

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
    const raw = res.data;

    const mappedUser: User = {
      userId: raw._id,
      username: raw.username,
      email: raw.email,
      phone: raw.phone,
      role: raw.role,
      status: raw.status,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };

    return { ...res, data: mappedUser };
  },

  // Update info
  updateInfo: async (userId: string, data: UserForm) => {
    const res = await authApi.updateInfo(userId, data);
    const raw = res.data;

    const mappedUser: User = {
      userId: raw._id,
      username: raw.username,
      email: raw.email,
      phone: raw.phone,
      role: raw.role,
      status: raw.status,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };

    return { ...res, data: mappedUser };
  },
};
