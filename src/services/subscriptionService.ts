import { subscriptionRepo } from "@src/repositories/subscriptionRepo";
import {
  PayForSubReq,
  PayNoVNPayReq,
  SubVehicleReq,
  UpdateSubReq,
} from "@src/types/subscription";

export const subscriptionService = {
  // Get List
  getSubPlans: async () => {
    return await subscriptionRepo.getSubPlans();
  },

  // Create
  create: async (payload: SubVehicleReq) => {
    return await subscriptionRepo.create(payload);
  },

  // Update
  update: async (subId: string, payload: UpdateSubReq) => {
    return await subscriptionRepo.update(subId, payload);
  },

  // Payment
  payForSubscription: async (payload: PayForSubReq) => {
    return await subscriptionRepo.payForSubscription(payload);
  },

  // No VNPay
  payNoVNPay: async (payload: PayNoVNPayReq) => {
    return await subscriptionRepo.payNoVNPay(payload);
  },
};
