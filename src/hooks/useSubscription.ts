import { useLoading } from "@src/context/LoadingContext";
import { subscriptionService } from "@src/services/subscriptionService";
import { mapErrorMsg } from "@src/utils/errorMsgMapper";

export const useSubscription = () => {
  const { showLoading, hideLoading } = useLoading();

  const getSubPlans = async () => {
    try {
      showLoading();
      const res = await subscriptionService.getSubPlans();

      const isSuccess = res.status === 200 || res.status === 201;
      return {
        success: isSuccess,
        subscriptions: res.data,
      };
    } catch (error: any) {
      const message = error.response?.data?.message || error.customMessage;
      const status = error?.response?.status;
      const viMessage = mapErrorMsg(message, status);
      return {
        success: false,
        message: viMessage || "Không thể lấy danh sách gói đăng ký!",
      };
    } finally {
      hideLoading();
    }
  };

  return { getSubPlans };
};
