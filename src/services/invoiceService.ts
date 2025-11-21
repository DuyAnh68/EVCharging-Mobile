import { invoiceRepo } from "@src/repositories/invoiceRepo";
import { PayForChargingReq } from "@src/types/invoice";

export const invoiceService = {
  // Get List
  getInvoices: async (userId: string, paymentStatus?: string) => {
    return await invoiceRepo.getInvoices(userId, paymentStatus);
  },

  // Get Detail
  getInvoiceDetail: async (invoiceId: string) => {
    return await invoiceRepo.getInvoiceDetail(invoiceId);
  },

  // Create Payment Url
  createPaymentUrl: async (payload: PayForChargingReq) => {
    return await invoiceRepo.createPaymentUrl(payload);
  },

  // No VNPay
  payNoVNPay: async (payload: PayForChargingReq) => {
    return await invoiceRepo.payNoVNPay(payload);
  },
};
