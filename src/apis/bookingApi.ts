import axiosClient from "@src/apis/axiosClient";
import { BookingReq } from "@src/types/booking";

export const bookingApi = {
  create: async (data: BookingReq) => {
    const res = await axiosClient.post(`/bookings`, data);
    return {
      status: res.status,
      data: res.data,
      message: res.data?.message,
    };
  },

  getAll: async () => {
    const res = await axiosClient.get(`/bookings`);
    return {
      status: res.status,
      data: res.data,
      message: res.data?.message,
    };
  },

  getById: async (id: string) => {
    const res = await axiosClient.get(`/bookings/${id}`);
    return {
      status: res.status,
      data: res.data,
      message: res.data?.message,
    };
  },

  update: async (id: string, data: Partial<BookingReq>) => {
    const res = await axiosClient.put(`/bookings/${id}`, data);
    return {
      status: res.status,
      data: res.data,
      message: res.data?.message,
    };
  },

  delete: async (id: string) => {
    const res = await axiosClient.delete(`/bookings/${id}`);
    return {
      status: res.status,
      data: res.data,
      message: res.data?.message,
    };
  },
};
