import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@src/styles/theme";
import type { Invoice } from "@src/types/invoice";
import { Transaction } from "@src/types/transaction";

// CHARGE
export const getChargeStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return COLORS.success;
    case "ongoing":
      return COLORS.info;
    case "failed":
      return COLORS.danger;
    default:
      return COLORS.inactive;
  }
};

export const getChargeStatusLabel = (status: string) => {
  switch (status) {
    case "completed":
      return "Hoàn thành";
    case "ongoing":
      return "Đang sạc";
    case "failed":
      return "Thất bại";
    default:
      return status;
  }
};

// INVOICE
export const getPaymentStatusColor = (
  status: Invoice["paymentStatus"]
): string => {
  switch (status) {
    case "paid":
      return COLORS.success;
    case "unpaid":
      return COLORS.danger;
    default:
      return COLORS.inactive;
  }
};

export const getPaymentStatusLabel = (
  status: Invoice["paymentStatus"]
): string => {
  const labels: Record<Invoice["paymentStatus"], string> = {
    paid: "Đã thanh toán",
    unpaid: "Chưa thanh toán",
  };
  return labels[status];
};

// TRANSACTION
export const getTransactionStatusColor = (
  status: Transaction["vnpTransactionStatus"]
): string => {
  return status === "00" ? COLORS.success : COLORS.danger;
};

export const getTransactionStatusLabel = (
  status: Transaction["vnpTransactionStatus"]
): string => {
  return status === "00" ? "Thành công" : "Thất bại";
};

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];
export const getTransactionType = (
  type: Transaction["type"]
): { name: string; icon: IoniconName; color: string } => {
  switch (type) {
    case "subscription":
      return {
        name: "Mua gói",
        icon: "pricetag-outline",
        color: COLORS.warning,
      };
    case "base_fee":
      return {
        name: "Phí đặt chỗ",
        icon: "document-text-outline",
        color: COLORS.info,
      };
    case "charging":
      return {
        name: "Phí sạc",
        icon: "flash-outline",
        color: COLORS.primary,
      };
    default:
      return {
        name: "Thanh toán tiền",
        icon: "wallet-outline",
        color: COLORS.inactive,
      };
  }
};
