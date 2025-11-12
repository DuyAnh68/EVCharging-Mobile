import { useLoading } from "@src/context/LoadingContext";
import { usePayment } from "@src/context/PaymentContext";
import { invoiceService } from "@src/services/invoiceService";
import { PayForChargingReq } from "@src/types/invoice";
import { router } from "expo-router";
import { useState } from "react";

export const useInvoice = () => {
  // Hook
  const { showLoading, hideLoading } = useLoading();
  const { setPaymentUrl } = usePayment();

  // State
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // GET LIST
  const getInvoices = async (userId: string, paymentStatus?: string) => {
    try {
      showLoading();
      const res = await invoiceService.getInvoices(userId, paymentStatus);

      const isSuccess = res.status === 200 || res.status === 201;

      if (!isSuccess) {
        return {
          success: false,
          message: res.message || "Không thể lấy danh sách hóa đơn!",
        };
      }

      const { data } = res;

      return {
        success: true,
        invoices: data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: "Không thể lấy danh sách hóa đơn!",
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
          message: res.message || "Không thể lấy chi tiết hóa đơn!",
        };
      }

      return {
        success: isSuccess,
        invoice: res.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: "Không thể lấy chi tiết hóa đơn!",
      };
    } finally {
      hideLoading();
    }
  };

  // PAYMENT
  const payForCharging = async (payload: PayForChargingReq) => {
    setIsLoading(true);
    try {
      const res = await invoiceService.createPaymentUrl(payload);

      const isSuccess = res.status === 200 || res.status === 201;

      if (!isSuccess) {
        return {
          success: false,
          message: "Không thể tạo phiên thanh toán. Hãy thử lại sau!",
        };
      }

      setPaymentUrl(res.data);

      setTimeout(() => {
        router.push({
          pathname: "/(vnpay)/payment-webview",
          params: {
            type: "charging_fee",
          },
        });
      }, 5);

      return {
        success: isSuccess,
        data: res.data,
      };
    } catch (error) {
      return {
        success: false,
        message: "Không thể tạo phiên thanh toán. Hãy thử lại sau!",
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getInvoices,
    getInvoiceDetail,
    payForCharging,
    isLoading,
  };
};
