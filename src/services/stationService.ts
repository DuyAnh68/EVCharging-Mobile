import { stationRepo } from "@src/repositories/stationRepo";

export const stationService = {
  getStations: async () => {
    return await stationRepo.getStations();
  },
};
