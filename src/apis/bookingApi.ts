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

  getAllMyBooking: async () => {
    const res = await axiosClient.get("/bookings/me");
    return {
      status: res.status,
      data: res.data,
      message: res.data?.message,
    };
  },

  getAll: async (params?: {
    user_id?: string;
    station_id?: string;
    vehicle_id?: string;
    chargingPoint_id?: string;
    status?: string;
    start_date?: string;
    end_date?: string;
    page?: number;
    limit?: number;
  }) => {
    const res = await axiosClient.get(`/bookings`, { params });
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
