import { useLoading } from "@src/context/LoadingContext";
import { transactionService } from "@src/services/transactionService";
import { Summary, Transaction } from "@src/types/transaction";

export const useTransaction = () => {
  // Hook
  const { showLoading, hideLoading } = useLoading();

  // GET LIST
  const getTransactions = async (
    type?: string
  ): Promise<{
    success: boolean;
    message?: string;
    transactions?: Transaction[];
    summary?: Summary;
  }> => {
    try {
      showLoading();
      const res = await transactionService.getTransactions(type);

      const isSuccess = res.status === 200 || res.status === 201;

      if (!isSuccess) {
        return {
          success: false,
          message: res.message || "Không thể lấy danh sách giao dịch!",
        };
      }

      return {
        success: true,
        transactions: res.transactions,
        summary: res.summary ?? undefined,
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

  const getTotalAmount = async (): Promise<{
    success: boolean;
    totalAmount?: number;
    message?: string;
  }> => {
    try {
      showLoading();
      const totalAmount = await transactionService.getTotalAmount();

      return {
        success: true,
        totalAmount,
      };
    } catch (error: any) {
      return {
        success: false,
        message: "Không thể lấy tổng số tiền đã sử dụng!",
      };
    } finally {
      hideLoading();
    }
  };

  return {
    getTransactions,
    getTotalAmount,
  };
};
