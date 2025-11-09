import axiosClient from "@src/apis/axiosClient";

export const invoiceApi = {
  // Get List
  getInvoices: async (userId: string, paymentStatus?: string) => {
    const res = await axiosClient.get(`/invoices/user/${userId}`, {
      params: {
        payment_status: paymentStatus || undefined,
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
    const res = await axiosClient.get(`/invoices/${invoiceId}`, {
      params: {
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
