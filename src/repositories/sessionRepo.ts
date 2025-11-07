import { sessionApi } from "@src/apis/sessionApi";
import { SessionDetail } from "@src/types/session";
import { toSessionListDetail } from "@src/utils/mapData";

export const sessionRepo = {
  // Create booking
  generateQR: async (bookingId: string) => {
    const res = await sessionApi.generateQR(bookingId);
    return res;
  },

  // Get List Completed
  getSessionsCompleted: async (userId: string) => {
    const res = await sessionApi.getSessionsCompleted(userId);

    const raw = res.data.sessions;
    const mapData: SessionDetail[] = toSessionListDetail(raw || []);

    return { ...res, data: mapData };
  },
};
