import axiosClient from "@src/apis/axiosClient";

export const transactionApi = {
  // Get List
  getTransactions: async (type?: string) => {
    const res = await axiosClient.get(`/payment/me`, {
      params: {
        type: type || undefined,
        limit: 50,
      },
    });

    return {
      status: res.status,
      data: res.data,
      message: res.data?.message,
    };
  },
};
