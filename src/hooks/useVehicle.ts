import { useLoading } from "@src/context/LoadingContext";
import { vehicleService } from "@src/services/vehicleService";
import { mapErrorMsg } from "@src/utils/errorMsgMapper";

export const useVehicle = () => {
  const { showLoading, hideLoading } = useLoading();

  const getVehicle = async () => {
    try {
      showLoading();
      const res = await vehicleService.getVehicles();
      const isSuccess = res.status === 200 || res.status === 201;
      console.log(res.data);
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
        message: viMessage || "Không thể lấy thông tin xe",
      };
    } finally {
      hideLoading();
    }
  };

  return { getVehicle };
};
