import axiosClient from "@src/apis/axiosClient";
import { PayForChargingReq } from "@src/types/invoice";

export const invoiceApi = {
  // Get List
  getInvoices: async (userId: string, paymentStatus?: string) => {
    const res = await axiosClient.get(`/invoices/user/${userId}`, {
      params: {
        payment_status: paymentStatus || undefined,
        limit: 50,
      },
    });

    return {
      status: res.status,
      data: res.data,
      message: res.data?.message,
    };
  },

  // Get Detail
  getInvoiceDetail: async (invoiceId: string) => {
    const res = await axiosClient.get(`/invoices/${invoiceId}`);

    return {
      status: res.status,
      data: res.data,
      message: res.data?.message,
    };
  },

  // Create Payment Url
  createPaymentUrl: async (payload: PayForChargingReq) => {
    const res = await axiosClient.post(`/payment/pay-for-charging`, payload);

    return {
      status: res.status,
      data: res.data,
      message: res.data?.message,
    };
  },
};
