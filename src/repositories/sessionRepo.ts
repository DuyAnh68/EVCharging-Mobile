import { sessionApi } from "@src/apis/sessionApi";

export const sessionRepo = {
  // Create booking
  generateQR: async (bookingId: string) => {
    const res = await sessionApi.generateQR(bookingId);
    return res;
  },
};
