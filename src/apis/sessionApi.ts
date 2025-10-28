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
};
