import { Invoice } from "@src/types/invoice";
import { formatRoundedAmount, formatTimeDuration } from "@src/utils/formatData";

// CHARGE
export const calcChargingDuration = (startTime: string, endTime: string) => {
  if (!startTime || !endTime) return "0s";

  const [startHour, startMinute, startSecond = 0] = startTime
    .split(":")
    .map(Number);
  const [endHour, endMinute, endSecond = 0] = endTime.split(":").map(Number);

  const start = new Date();
  start.setHours(startHour, startMinute, startSecond, 0);

  const end = new Date();
  end.setHours(endHour, endMinute, endSecond, 0);

  let diffMs = end.getTime() - start.getTime();

  // Nếu end < start (qua ngày hôm sau)
  if (diffMs < 0) {
    diffMs += 24 * 60 * 60 * 1000; // cộng thêm 1 ngày
  }

  const diffSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(diffSeconds / 3600);
  const minutes = Math.floor((diffSeconds % 3600) / 60);
  const seconds = diffSeconds % 60;

  return formatTimeDuration(hours, minutes, seconds);
};

/**
 * Tính tổng thời gian sạc của tất cả các phiên (sessions)
 * @param sessions Mảng các phiên sạc, mỗi phiên có startTime và endTime
 * @returns Chuỗi hiển thị dạng "Xh Yp Zs"
 */
export const calcTotalChargingDuration = (
  sessions: { startTime: string; endTime: string }[]
): string => {
  if (!sessions || sessions.length === 0) return "0s";

  const totalMilliseconds = sessions.reduce((sum, session) => {
    const start = new Date(session.startTime).getTime();
    const end = new Date(session.endTime).getTime();
    const duration = end - start;
    return sum + (duration > 0 ? duration : 0);
  }, 0);

  const totalSeconds = Math.floor(totalMilliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return formatTimeDuration(hours, minutes, seconds);
};

/**
 * Chuyển tổng số giây về thành chuỗi hiển thị (Xh Ym Zs)
 * @param input Tổng số giây hoặc chuỗi chứa số giây (ví dụ: "3600", "3600 giây")
 * @returns Chuỗi hiển thị dạng "Xh Yp Zs"
 */
export const calcSecondsToDuration = (input: number | string): string => {
  if (input === null || input === undefined) return "0s";

  // Nếu input là chuỗi có chữ "giây" → loại bỏ chữ đó
  let totalSeconds = 0;
  if (typeof input === "string") {
    const numeric = input.replace(/[^\d]/g, ""); // chỉ lấy phần số
    totalSeconds = parseInt(numeric, 10);
  } else {
    totalSeconds = input;
  }

  if (isNaN(totalSeconds) || totalSeconds <= 0) return "0s";

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return formatTimeDuration(hours, minutes, seconds);
};

// INVOICE
/**
 * Tính tổng tiền của các hóa đơn được chọn.
 */
export const calcTotalAmount = (selectedInvoices: Invoice[]): number => {
  return selectedInvoices.reduce((total, inv) => {
    const rounded = formatRoundedAmount(inv.totalAmount);
    return total + rounded;
  }, 0);
};
