export type TransactionType = "subscription" | "base_fee" | "charging";

export interface Transaction {
  id: string;
  type: TransactionType;
  companyId: string | null;
  vnpTxnRef: string;
  vnpAmount: number;
  vnpTransactionNo: string;
  vnpBankCode: string;
  vnpCardType: string;
  vnpPayDate: string;
  vnpResponseCode: string;
  vnpTransactionStatus: string;
}

export interface SummaryItem {
  count: number;
  totalAmount: number;
}

export interface Summary {
  subscription: SummaryItem;
  base_fee: SummaryItem;
  charging: SummaryItem;
}

export type TransactionReturn = {
  status: number;
  message?: string;
  transactions: Transaction[];
  summary?: Summary; 
};
