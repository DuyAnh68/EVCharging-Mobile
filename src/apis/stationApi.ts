import axiosClient from "@src/apis/axiosClient";

export const stationApi = {
  getStations: async () => {
    const res = await axiosClient.get(`/stations`);
    return res;
  },
  getStationById: async (id: string) => {
    const res = await axiosClient.get(`/stations/${id}`);
    return res;
  },
  getChargingPoints: async (stationId: string) => {
    const res = await axiosClient.get(`/stations/${stationId}/charging-points`);
    return res;
  },
};
