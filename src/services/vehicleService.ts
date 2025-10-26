import { vehicleRepo } from "@src/repositories/vehicleRepo";

export const vehicleService = {
  getVehicles: async () => {
    return await vehicleRepo.getVehicles();
  },
};
