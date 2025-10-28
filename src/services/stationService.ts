import { stationRepo } from "@src/repositories/stationRepo";

export const stationService = {
  getStations: async () => {
    return await stationRepo.getStations();
  },
  getStationById: async (id: string) => {
    return await stationRepo.getStationById(id);
  },
  getChargingPoints: async (stationId: string) => {
    return await stationRepo.getChargingPoints(stationId);
  },
};
