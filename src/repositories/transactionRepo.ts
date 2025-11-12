import { transactionApi } from "@src/apis/transactionApi";
import { Transaction } from "@src/types/transaction";
import { toTransactionList } from "@src/utils/mapData";

export const transactionRepo = {
  // Get List
  getTransactions: async (type?: string) => {
    const res = await transactionApi.getTransactions(type);

    const raw = res.data.payments;
    const mapData: Transaction[] = toTransactionList(raw || []);

    return { ...res, data: mapData, totalAmount: res.data.total_amount };
  },
};
