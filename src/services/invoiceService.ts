import { invoiceRepo } from "@src/repositories/invoiceRepo";

export const invoiceService = {
  // Get List
  getInvoices: async (userId: string, paymentStatus?: string) => {
    return await invoiceRepo.getInvoices(userId, paymentStatus);
  },

  // Get Detail
  getInvoiceDetail: async (invoiceId: string) => {
    return await invoiceRepo.getInvoiceDetail(invoiceId);
  },
};
