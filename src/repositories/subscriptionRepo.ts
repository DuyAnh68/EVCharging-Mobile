import { subscriptionApi } from "@src/apis/subscriptionApi";
import { VehicleDetail } from "@src/types/vehicle";
import { toVehicleListDetail } from "@src/utils/mapData";

export const subscriptionRepo = {
  getSubPlans: async () => {
    const res = await subscriptionApi.getSubPlans();

    const raw = res.data;
    const mapData: VehicleDetail[] = toVehicleListDetail(raw?.vehicles || []);

    return { ...res, data: mapData };
  },
};
