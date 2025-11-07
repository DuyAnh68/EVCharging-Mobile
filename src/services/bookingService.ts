import { bookingRepo } from "@src/repositories/bookingRepo";
import { BookingReq } from "@src/types/booking";

export const bookingService = {
  // Create booking
  create: async (data: BookingReq) => {
    return await bookingRepo.create(data);
  },

  // Get all bookings
  getAllFilterChargingPoints: async (chargingPointId: string) => {
    return await bookingRepo.getAllFilterChargingPoints(chargingPointId);
  },

  getAllMyBooking: async () => {
    return await bookingRepo.getAllMyBooking();
  },

  // Get booking by ID
  getById: async (id: string) => {
    return await bookingRepo.getById(id);
  },

  // Update booking
  update: async (id: string, data: Partial<BookingReq>) => {
    return await bookingRepo.update(id, data);
  },

  // Delete booking
  delete: async (id: string) => {
    return await bookingRepo.delete(id);
  },
};
