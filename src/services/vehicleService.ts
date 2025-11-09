import { vehicleRepo } from "@src/repositories/vehicleRepo";
import { VehicleDetail, VehicleReq } from "@src/types/vehicle";

export const vehicleService = {
  // Get List
  getVehicles: async () => {
    const res = await vehicleRepo.getVehicles();

    const activeVehicles: VehicleDetail[] = (res.data || []).filter(
      (vehicle) => vehicle.isActive === true
    );

    return { ...res, data: activeVehicles };
  },

  // Create
  create: async (payload: VehicleReq) => {
    return await vehicleRepo.create(payload);
  },

  // Update
  update: async (vehicleId: string, payload: VehicleReq) => {
    return await vehicleRepo.update(vehicleId, payload);
  },

  // Delete
  delete: async (vehicleId: string) => {
    return await vehicleRepo.delete(vehicleId);
  },
};
