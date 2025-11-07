export function formatDateTime(isoString: string) {
  const date = new Date(isoString);
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

export const formatVND = (amount: number): string => {
  if (isNaN(amount)) return "0 đ";

  const roundedAmount = Math.round(amount);

  return `${roundedAmount.toLocaleString("vi-VN")}đ`;
};

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
