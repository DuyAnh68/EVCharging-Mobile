import axiosClient from "@src/apis/axiosClient";

export const sessionApi = {
  // Get List Completed
  getSessionsCompleted: async (userId: string) => {
    const res = await axiosClient.get(`/charging-sessions`, {
      params: {
        user_id: userId,
        status: "completed",
      },
    });
    return {
      status: res.status,
      data: res.data,
      message: res.data?.message,
    };
  },
};
