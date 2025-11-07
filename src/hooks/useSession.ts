import { useLoading } from "@src/context/LoadingContext";
import { useStation } from "@src/hooks/useStation";
import { sessionService } from "@src/services/sessionService";
import { SessionDetail } from "@src/types/session";

export const useSession = () => {
  // Hook
  const { showLoading, hideLoading } = useLoading();
  const { getStationById } = useStation();

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
    getSessionsCompleted,
  };
};
