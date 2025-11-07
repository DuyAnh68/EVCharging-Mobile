import { sessionRepo } from "@src/repositories/sessionRepo";

export const sessionService = {
  // Get List Completed
  getSessionsCompleted: async (userId: string) => {
    return await sessionRepo.getSessionsCompleted(userId);
  },
};
