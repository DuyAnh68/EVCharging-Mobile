import { vehicleApi } from "./../apis/vehicleApi";

export const vehicleRepo = {
  getVehicles: async () => {
    const res = await vehicleApi.getVehicles();
    return res;
  },
};
