import axiosClient from "@src/apis/axiosClient";

export const vehicleApi = {
  getVehicles: async () => {
    const res = await axiosClient.get(`/vehicles/me`);
    return {
      status: res.status,
      data: res.data,
      message: res.data?.message,
    };
  },
};
