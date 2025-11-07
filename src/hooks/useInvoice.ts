import { useLoading } from "@src/context/LoadingContext";
import { invoiceService } from "@src/services/invoiceService";

export const useInvoice = () => {
  // Hook
  const { showLoading, hideLoading } = useLoading();

  // GET LIST
  const getInvoices = async (userId: string, paymentStatus?: string) => {
    try {
      showLoading();
      const res = await invoiceService.getInvoices(userId, paymentStatus);

      const isSuccess = res.status === 200 || res.status === 201;

      if (!isSuccess) {
        return {
          success: false,
          message: res.message || "Không thể lấy danh sách giao dịch!",
        };
      }

      const { data, counts } = res;

      return {
        success: true,
        invoices: data,
        counts: counts || null,
      };
    } catch (error: any) {
      return {
        success: false,
        message: "Không thể lấy danh sách giao dịch!",
      };
    } finally {
      hideLoading();
    }
  };

  // GET DETAIL
  const getInvoiceDetail = async (invoiceId: string) => {
    try {
      showLoading();
      const res = await invoiceService.getInvoiceDetail(invoiceId);

      const isSuccess = res.status === 200 || res.status === 201;

      if (!isSuccess) {
        return {
          success: false,
          message: res.message || "Không thể lấy chi tiết giao dịch!",
        };
      }

      return {
        success: isSuccess,
        invoice: res.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: "Không thể lấy chi tiết giao dịch!",
      };
    } finally {
      hideLoading();
    }
  };

  return {
    getInvoices,
    getInvoiceDetail,
  };
};
