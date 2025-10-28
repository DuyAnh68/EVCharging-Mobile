import { vehicleRepo } from "@src/repositories/vehicleRepo";
import { VehicleReq } from "@src/types/vehicle";

export const vehicleService = {
  // Get List
  getVehicles: async () => {
    return await vehicleRepo.getVehicles();
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
