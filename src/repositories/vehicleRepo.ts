import { vehicleApi } from "@src/apis/vehicleApi";
import { VehicleDetail, VehicleReq } from "@src/types/vehicle";
import { toVehicleListDetail } from "@src/utils/mapData";

export const vehicleRepo = {
  // Get List
  getVehicles: async () => {
    const res = await vehicleApi.getVehicles();

    const raw = res.data;
    const mapData: VehicleDetail[] = toVehicleListDetail(raw?.vehicles || []);

    return { ...res, data: mapData };
  },

  // Create
  create: async (payload: VehicleReq) => {
    const res = await vehicleApi.create(payload);

    return res;
  },

  // Update
  update: async (vehicleId: string, payload: VehicleReq) => {
    const res = await vehicleApi.update(vehicleId, payload);

    return res;
  },

  // Delete
  delete: async (vehicleId: string) => {
    const res = await vehicleApi.delete(vehicleId);

    return res;
  },
};
