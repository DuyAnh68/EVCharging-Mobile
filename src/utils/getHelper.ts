import { COLORS } from "@src/styles/theme";
import type { Invoice } from "@src/types/invoice";

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
      return COLORS.gray500;
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
      return COLORS.gray600;
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
