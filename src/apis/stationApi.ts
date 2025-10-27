import axiosClient from "@src/apis/axiosClient";

export const stationApi = {
  getStations: async () => {
    const res = await axiosClient.get(`/stations`);
    return res;
  },
  getStationById: async (id: String) => {
    const res = await axiosClient.get(`/stations/${id}`);
    return res;
  },
};
