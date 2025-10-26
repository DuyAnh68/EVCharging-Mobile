import axiosClient from "@src/apis/axiosClient";
import { LoginReq, RegisterReq } from "@src/types/auth";

export const authApi = {
  // REGISTER
  register: async (data: RegisterReq) => {
    const res = await axiosClient.post(`/auth/register`, data);
    return {
      status: res.status,
      data: res.data,
      message: res.data?.message,
    };
  },

  // LOGIN
  login: async (data: LoginReq) => {
    const res = await axiosClient.post(`/auth/login`, data);
    return {
      status: res.status,
      data: res.data,
      message: res.data?.message,
    };
  },

  // REFRESH
  refresh: async (data: string) => {
    const res = await axiosClient.post(`/auth/refresh`, { refreshToken: data });
    return {
      status: res.status,
      data: res.data,
      message: res.data?.message,
    };
  },

  // GET INFO
  getInfo: async () => {
    const res = await axiosClient.get(`/accounts/me`);
    return {
      status: res.status,
      data: res.data,
      message: res.data?.message,
    };
  },
};
