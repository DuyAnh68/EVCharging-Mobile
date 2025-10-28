import { useLoading } from "@src/context/LoadingContext";
import { sessionService } from "@src/services/sessionService";
import { mapErrorMsg } from "@src/utils/errorMsgMapper";

export const useSession = () => {
  const { showLoading, hideLoading } = useLoading();

  const generateQR = async (bookingId: string) => {
    try {
      showLoading();
      const res = await sessionService.generateQR(bookingId);
      const isSuccess = res.status === 200 || res.status === 201;
      return {
        success: isSuccess,
        data: res.data,
        message: res.data?.message || "Lỗi khi tải phiên sạc",
      };
    } catch (error: any) {
      const message = error.response?.data?.message || error.customMessage;
      const status = error?.response?.status;
      const viMessage = mapErrorMsg(message, status);
      return {
        success: false,
        message: viMessage || "Không tạo được phiên sạc",
      };
    } finally {
      hideLoading();
    }
  };

  return {
    generateQR,
  };
};
