import axiosClient from "@src/apis/axiosClient";

export const sessionApi = {
  generateQR: async (bookingId: string) => {
    const res = await axiosClient.post(
      `/charging-sessions/generate-qr/${bookingId}`
    );
    return {
      status: res.status,
      data: res.data,
      message: res.data?.message,
    };
  },
  startSession: async (
    qrToken: string,
    body: { initial_battery_percentage: number }
  ) => {
    const res = await axiosClient.post(
      `/charging-sessions/start/${qrToken}`,
      body
    );
    return {
      status: res.status,
      data: res.data,
      message: res.data?.message,
    };
  },
  endSession: async (sessionId: string) => {
    const res = await axiosClient.post(`/charging-sessions/end/${sessionId}`);
    return {
      status: res.status,
      data: res.data,
      message: res.data?.message,
    };
  },
};
