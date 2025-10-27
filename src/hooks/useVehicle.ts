import { useLoading } from "@src/context/LoadingContext";
import { vehicleService } from "@src/services/vehicleService";
import { mapErrorMsg } from "@src/utils/errorMsgMapper";

export const useVehicle = () => {
  const { showLoading, hideLoading } = useLoading();

  const getVehicles = async () => {
    try {
      showLoading();
      const res = await vehicleService.getVehicles();
      const isSuccess = res.status === 200 || res.status === 201;
      return {
        success: isSuccess,
        vehicles: res.data,
      };
    } catch (error: any) {
      const message = error.response?.data?.message || error.customMessage;
      const status = error?.response?.status;
      const viMessage = mapErrorMsg(message, status);
      return {
        success: false,
        message: viMessage || "Không thể lấy danh sách xe!",
      };
    } finally {
      hideLoading();
    }
  };

  return { getVehicles };
};
