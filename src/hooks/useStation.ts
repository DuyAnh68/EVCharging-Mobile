// hooks/useAuth.ts
import { useLoading } from "@src/context/LoadingContext";
import { stationService } from "@src/services/stationService";

export const useStation = () => {
  const { showLoading, hideLoading } = useLoading();

  // Decode
  const getStations = async () => {
    try {
      showLoading();
      const res = await stationService.getStations();
      const isSuccess = res.status === 200 || res.status === 201;
      return {
        success: isSuccess,
        stations: res.data,
      };
    } catch (error) {
      console.error("Fail to fetch data:", error);
      return null;
    } finally {
      hideLoading();
    }
  };

  return { getStations };
};
