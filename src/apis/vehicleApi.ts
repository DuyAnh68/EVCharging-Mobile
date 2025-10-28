import axiosClient from "@src/apis/axiosClient";
import { VehicleReq } from "@src/types/vehicle";

export const vehicleApi = {
  // Get List
  getVehicles: async () => {
    const res = await axiosClient.get(`/vehicles/me`);
    return {
      status: res.status,
      data: res.data,
      message: res.data?.message,
    };
  },

  // Create
  create: async (payload: VehicleReq) => {
    const res = await axiosClient.post(`/vehicles`, payload);
    return {
      status: res.status,
      data: res.data,
      message: res.data?.message,
    };
  },

  // Update
  update: async (vehicleId: string, payload: VehicleReq) => {
    const res = await axiosClient.put(`/vehicles/${vehicleId}`, payload);
    return {
      status: res.status,
      data: res.data,
      message: res.data?.message,
    };
  },

  // Delete
  delete: async (vehicleId: string) => {
    const res = await axiosClient.delete(`/vehicles/${vehicleId}`);

    return {
      status: res.status,
      data: res.data,
      message: res.data?.message,
    };
  },
};
