import { transactionRepo } from "@src/repositories/transactionRepo";
import {
  Summary,
  Transaction,
  TransactionReturn,
} from "@src/types/transaction";
import { calcSummaryByType } from "@src/utils/calculateData";

export const transactionService = {
  // Get List
  getTransactions: async (type?: string): Promise<TransactionReturn> => {
    const res = await transactionRepo.getTransactions(type);
    const transactions = res.data as Transaction[];

    if (type) {
      return {
        ...res,
        transactions,
      };
    }

    const summary: Summary = {
      subscription: calcSummaryByType(transactions, "subscription"),
      base_fee: calcSummaryByType(transactions, "base_fee"),
      charging: calcSummaryByType(transactions, "charging"),
    };

    return {
      ...res,
      transactions,
      summary,
    };
  },

  // Get Total Amount
  getTotalAmount: async (): Promise<number> => {
    const res = await transactionRepo.getTransactions();
    return res.totalAmount || 0;
  },
};
