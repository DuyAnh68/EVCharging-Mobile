import { subscriptionApi } from "@src/apis/subscriptionApi";
import { SubscriptionPlan } from "@src/types/subscription";
import { toSubPlanListDetail } from "@src/utils/mapData";

export const subscriptionRepo = {
  getSubPlans: async () => {
    const res = await subscriptionApi.getSubPlans();

    const raw = res.data;
    const mapData: SubscriptionPlan[] = toSubPlanListDetail(raw || []);

    return { ...res, data: mapData };
  },
};
