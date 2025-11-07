import { sessionApi } from "@src/apis/sessionApi";
import { useLoading } from "@src/context/LoadingContext";
import { useStation } from "@src/hooks/useStation";
import { sessionService } from "@src/services/sessionService";
import { SessionDetail } from "@src/types/session";
import { mapErrorMsg } from "@src/utils/errorMsgMapper";

export const useSession = () => {
  // Hook
  const { showLoading, hideLoading } = useLoading();
  const { getStationById } = useStation();

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
  const startSession = async (qrToken: string, initialBattery: number) => {
    try {
      showLoading();
      const res = await sessionApi.startSession(qrToken, {
        initial_battery_percentage: initialBattery,
      });

      const isSuccess = res.status === 200 || res.status === 201;
      return {
        success: isSuccess,
        data: res.data,
        message: res.data?.message || "Bắt đầu phiên sạc thành công",
      };
    } catch (error: any) {
      const message = error.response?.data?.message || error.customMessage;
      const status = error?.response?.status;
      const viMessage = mapErrorMsg(message, status);
      return {
        success: false,
        message: viMessage || "Không thể bắt đầu phiên sạc",
      };
    } finally {
      hideLoading();
    }
  };
  const endSession = async (sessionId: string) => {
    try {
      showLoading();
      const res = await sessionApi.endSession(sessionId);

      const isSuccess = res.status === 200 || res.status === 201;
      return {
        success: isSuccess,
        data: res.data,
        message: res.data?.message || "Bắt đầu phiên sạc thành công",
      };
    } catch (error: any) {
      const message = error.response?.data?.message || error.customMessage;
      const status = error?.response?.status;
      const viMessage = mapErrorMsg(message, status);
      return {
        success: false,
        message: viMessage || "Không thể kết thúc phiên sạc",
      };
    } finally {
      hideLoading();
    }
  };

  // GET LIST COMPLETED
  const getSessionsCompleted = async (userId: string) => {
    try {
      showLoading();
      const resSession = await sessionService.getSessionsCompleted(userId);

      const isSuccess = resSession.status === 200 || resSession.status === 201;

      if (!isSuccess) {
        return {
          success: false,
          message: resSession.message || "Không thể lấy lịch sử sạc!",
        };
      }

      const sessions: SessionDetail[] = resSession.data;

      const sessionsWithStation = await Promise.all(
        sessions.map(async (session) => {
          const resStation = await getStationById(
            session.chargingPoint.stationId
          );

          return {
            ...session,
            station: resStation.station.station,
          };
        })
      );

      return {
        success: isSuccess,
        sessions: sessionsWithStation,
      };
    } catch (error: any) {
      return {
        success: false,
        message: "Không thể lấy lịch sử sạc!",
      };
    } finally {
      hideLoading();
    }
  };

  return {
    generateQR,
    startSession,
    endSession,
    getSessionsCompleted,
  };
};
