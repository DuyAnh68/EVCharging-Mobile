import { stationApi } from "@src/apis/stationApi";

export const stationRepo = {
  getStations: async () => {
    const res = await stationApi.getStations();
    return res;
  },
  getStationById: async (id: string) => {
    const res = await stationApi.getStationById(id);
    return res;
  },
  getChargingPoints: async (stationId: string) => {
    const res = await stationApi.getChargingPoints(stationId);
    return res;
  },
};
