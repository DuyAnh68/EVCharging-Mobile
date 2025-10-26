import { stationApi } from "@src/apis/stationApi";

export const stationRepo = {
  getStations: async () => {
    const res = await stationApi.getStations();
    return res;
  },
};
