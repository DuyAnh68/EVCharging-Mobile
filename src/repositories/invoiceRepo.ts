import { invoiceApi } from "@src/apis/invoiceApi";
import { InvoiceDetail, InvoiceResponse } from "@src/types/invoice";
import { toInvoiceDetail, toInvoiceList } from "@src/utils/mapData";

export const invoiceRepo = {
  // Get List
  getInvoices: async (userId: string, paymentStatus?: string) => {
    const res = await invoiceApi.getInvoices(userId, paymentStatus);

    const raw = res.data;
    const mapData: InvoiceResponse = toInvoiceList(raw || []);

    return { ...res, data: mapData };
  },

  // Get Detail
  getInvoiceDetail: async (invoiceId: string) => {
    const res = await invoiceApi.getInvoiceDetail(invoiceId);

    const raw = res.data;
    const mapData: InvoiceDetail = toInvoiceDetail(raw || []);

    return { ...res, data: mapData };
  },
};
