import { sessionRepo } from "@src/repositories/sessionRepo";

export const sessionService = {
  // Create booking
  generateQR: async (bookingId: string) => {
    return await sessionRepo.generateQR(bookingId);
  },

  // Get List Completed
  getSessionsCompleted: async (userId: string) => {
    return await sessionRepo.getSessionsCompleted(userId);
  },
};
