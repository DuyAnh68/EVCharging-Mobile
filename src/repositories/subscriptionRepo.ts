import { subscriptionApi } from "@src/apis/subscriptionApi";
import {
  PayForSubReq,
  SubscriptionPlan,
  SubVehicleReq,
  UpdateSubReq,
} from "@src/types/subscription";
import { toSubPlanListDetail } from "@src/utils/mapData";

export const subscriptionRepo = {
  // Get List
  getSubPlans: async () => {
    const res = await subscriptionApi.getSubPlans();

    const raw = res.data;
    const mapData: SubscriptionPlan[] = toSubPlanListDetail(raw || []);

    return { ...res, data: mapData };
  },

  // Create
  create: async (payload: SubVehicleReq) => {
    const res = await subscriptionApi.create(payload);

    return res;
  },

  // Update
  update: async (subId: string, payload: UpdateSubReq) => {
    const res = await subscriptionApi.update(subId, payload);

    return res;
  },

  // Payment
  payForSubscription: async (payload: PayForSubReq) => {
    const res = await subscriptionApi.payForSubscription(payload);

    return res;
  }
};
