import axiosClient from "@src/apis/axiosClient";
import {
  PayForSubReq,
  SubVehicleReq,
  UpdateSubReq,
} from "@src/types/subscription";

export const subscriptionApi = {
  // Get List
  getSubPlans: async () => {
    const res = await axiosClient.get(`/subscription-plans`, {
      params: {
        is_active: true,
        isCompany: false,
      },
    });
    return {
      status: res.status,
      data: res.data,
      message: res.data?.message,
    };
  },

  // Create
  create: async (payload: SubVehicleReq) => {
    const res = await axiosClient.post(`/vehicle-subscriptions`, payload);

    return {
      status: res.status,
      data: res.data,
      message: res.data?.message,
    };
  },

  // Update
  update: async (subId: string, payload: UpdateSubReq) => {
    const res = await axiosClient.patch(
      `/vehicle-subscriptions/${subId}/select-option-after-expire`,
      payload
    );

    return {
      status: res.status,
      data: res.data,
      message: res.data?.message,
    };
  },

  // Payment
  payForSubscription: async (payload: PayForSubReq) => {
    const res = await axiosClient.post(`/payment/pay-for-subscription`, payload);

    return {
      status: res.status,
      data: res.data,
      message: res.data?.message,
    };
  },
};
