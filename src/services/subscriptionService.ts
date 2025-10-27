import { subscriptionRepo } from "@src/repositories/subscriptionRepo";

export const subscriptionService = {
  getSubPlans: async () => {
    return await subscriptionRepo.getSubPlans();
  },
};
