import { bookingApi } from "@src/apis/bookingApi";
import { BookingReq } from "@src/types/booking";

export const bookingRepo = {
  // Create booking
  create: async (data: BookingReq) => {
    const res = await bookingApi.create(data);
    return res;
  },

  // Get all bookings
  getAllFilterChargingPoints: async (chargingPointId: string) => {
    const res = await bookingApi.getAll({ chargingPoint_id: chargingPointId });
    return res;
  },

  // Get booking by ID
  getById: async (id: string) => {
    const res = await bookingApi.getById(id);
    return res;
  },

  // Update booking
  update: async (id: string, data: Partial<BookingReq>) => {
    const res = await bookingApi.update(id, data);
    return res;
  },

  // Delete booking
  delete: async (id: string) => {
    const res = await bookingApi.delete(id);
    return res;
  },
};
