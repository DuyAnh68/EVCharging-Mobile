export function formatDateTime(isoString: string) {
  const date = new Date(isoString);
  const localDate = date.toLocaleDateString("vi-VN");
  const localTime = date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const formatted = `${localTime} ${localDate} `;
  return { date: localDate, time: localTime, formatted };
}

export const formatVND = (amount: number): string => {
  if (isNaN(amount)) return "0 VND";

  return `${amount.toLocaleString("vi-VN")} VND`;
};
