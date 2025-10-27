// hooks/useAuth.ts
import { useLoading } from "@src/context/LoadingContext";
import { stationService } from "@src/services/stationService";
import { mapErrorMsg } from "@src/utils/errorMsgMapper";

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
    } catch (error: any) {
      const message = error.response?.data?.message || error.customMessage;
      const status = error?.response?.status;
      const viMessage = mapErrorMsg(message, status);
      return {
        success: false,
        message: viMessage || "Không thể lấy thông tin trạm sạc",
      };
    } finally {
      hideLoading();
    }
  };

  const getStationById = async (id: string) => {
    try {
      showLoading();
      const res = await stationService.getStationById(id);
      const isSuccess = res.status === 200 || res.status === 201;
      return {
        success: isSuccess,
        station: res.data,
      };
    } catch (error: any) {
      const message = error.response?.data?.message || error.customMessage;
      const status = error?.response?.status;
      const viMessage = mapErrorMsg(message, status);
      return {
        success: false,
        message: viMessage || "Không thể lấy thông tin trạm sạc",
      };
    } finally {
      hideLoading();
    }
  };

  const getChargingPoints = async (stationId: string) => {
    try {
      showLoading();
      const res = await stationService.getChargingPoints(stationId);
      const isSuccess = res.status === 200 || res.status === 201;
      return {
        success: isSuccess,
        chargingPoints: res.data,
      };
    } catch (error: any) {
      const message = error.response?.data?.message || error.customMessage;
      const status = error?.response?.status;
      const viMessage = mapErrorMsg(message, status);
      return {
        success: false,
        message: viMessage || "Không thể lấy thông tin trụ sạc",
      };
    } finally {
      hideLoading();
    }
  };

  return { getStations, getStationById, getChargingPoints };
};
