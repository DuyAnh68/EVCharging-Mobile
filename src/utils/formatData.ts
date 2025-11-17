/**
 * Định dạng dateTime
 */
export function formatDateTime(dateString: string) {
  let date: Date;

  // Nếu là vnp_PayDate (dạng 20251111112835)
  if (/^\d{14}$/.test(dateString)) {
    const year = dateString.slice(0, 4);
    const month = dateString.slice(4, 6);
    const day = dateString.slice(6, 8);
    const hour = dateString.slice(8, 10);
    const minute = dateString.slice(10, 12);
    const second = dateString.slice(12, 14);
    date = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
  }
  // Ngược lại, xử lý như ISO string bình thường
  else {
    date = new Date(dateString);
  }
  if (isNaN(date.getTime())) {
    return {
      date: "-",
      time: "-",
      timeWithSeconds: "-",
      dateWithMinute: "-",
      formatted: "-",
    };
  }

  const localDate = date.toLocaleDateString("vi-VN");
  const time = date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const timeWithSeconds = date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const formatted = `${timeWithSeconds} ${localDate}`;

  const dateWithMinute = `${time} ${localDate}`;

  return { date: localDate, time, timeWithSeconds, dateWithMinute, formatted };
}

/**
 * Định dạng chuỗi về dạng tiền, ví dụ: "6.450 đ" → 6450
 */
export const parseVND = (amount: string | number | undefined): number => {
  if (!amount) return 0;
  if (typeof amount === "number") return amount;

  const numeric = amount.replace(/[^\d]/g, "");
  return Number(numeric || 0);
};

/**
 * Định dạng số tiền về dạng chuỗi VND, ví dụ: 15200000 → "15.200.000đ"
 */
export const formatVND = (amount: string | number): string => {
  if (amount === null || amount === undefined) return "0đ";

  // Nếu là string → loại bỏ các ký tự không phải số (đ, VND, dấu cách, dấu phẩy,...)
  if (typeof amount === "string") {
    amount = amount
      .replace(/[^\d]/g, "") // giữ lại đúng số, bỏ toàn bộ ký tự khác
      .trim();
  }

  const num = Number(amount);
  if (isNaN(num)) return "0 đ";

  const roundedAmount = Math.round(num);

  return `${roundedAmount.toLocaleString("vi-VN")}đ`;
};

/**
 * Làm tròn số tiền theo quy tắc:
 * - < 500 → làm tròn xuống 1.000
 * - ≥ 500 → làm tròn lên 1.000
 * Hỗ trợ đầu vào là number hoặc string có chứa "đ" hoặc "VND"
 */
export function formatRoundedAmount(
  value: number | string,
  options?: { asString?: false }
): number;
export function formatRoundedAmount(
  value: number | string,
  options: { asString: true }
): string;
export function formatRoundedAmount(
  value: number | string,
  options?: { asString?: boolean }
): number | string {
  if (value === null || value === undefined)
    return options?.asString ? "0đ" : 0;

  let numericValue: number;

  if (typeof value === "string") {
    const cleaned = value
      .replace(/đ|VND/gi, "") // bỏ ký tự đơn vị
      .replace(/\./g, "") // ❗ bỏ dấu chấm ngăn nghìn
      .replace(",", ".") // chuyển , thành . (trường hợp có thập phân)
      .replace(/[^\d.]/g, "") // bỏ ký tự không phải số hoặc dấu .
      .trim();

    numericValue = parseFloat(cleaned);
  } else {
    numericValue = value;
  }

  if (isNaN(numericValue)) return options?.asString ? "0đ" : 0;

  // Làm tròn đến 1.000 đồng gần nhất
  const remainder = numericValue % 1000;
  const rounded =
    remainder >= 500
      ? numericValue + (1000 - remainder)
      : numericValue - remainder;

  // Nếu asString = true thì format thành VND
  return options?.asString ? formatVND(rounded) : rounded;
}

/**
 * Định dạng khoảng thời gian
 */
const durationMap: Record<string, string> = {
  "1 month": "1 tháng",
  "3 months": "3 tháng",
  "6 months": "6 tháng",
  "1 year": "1 năm",
};

export const formatDuration = (duration: string): string => {
  return durationMap[duration.toLowerCase()] || duration;
};

export const formatTimeDuration = (
  hours: number,
  minutes: number,
  seconds: number
): string => {
  if (hours && minutes && seconds) return `${hours}h ${minutes}p ${seconds}s`;
  if (hours && minutes) return `${hours}h ${minutes}p`;
  if (hours) return `${hours}h`;
  if (minutes && seconds) return `${minutes}p ${seconds}s`;
  if (minutes) return `${minutes}p`;
  return `${seconds}s`;
};
