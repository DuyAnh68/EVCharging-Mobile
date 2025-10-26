import axiosClient from "@src/apis/axiosClient";

export const vehicleApi = {
  getVehicles: async () => {
    const res = await axiosClient.get(`/vehicles/me`);
    return res;
  },
};
