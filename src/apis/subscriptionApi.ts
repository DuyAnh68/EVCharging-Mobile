import axiosClient from "@src/apis/axiosClient";

export const subscriptionApi = {
  getSubPlans: async () => {
    const res = await axiosClient.get(`/subscription-plans`, {
      params: {
        is_active: true,
        limit_type: "users",
      },
    });
    return {
      status: res.status,
      data: res.data,
      message: res.data?.message,
    };
  },
};
