import { usePayment } from "@src/context/PaymentContext";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import { useEffect } from "react";

export default function DeepLinkHandler() {
  const { setPaymentResult, type, resetPayment } = usePayment();

  useEffect(() => {
    // Hàm xử lý khi có deep link
    const handleDeepLink = (event: Linking.EventType) => {
      const url = event.url;
      console.log("🔗 Deep link nhận được:", url);

      if (
        url.startsWith("evchargingapp://payment/return") &&
        router.canGoBack()
      ) {
        // Đã xử lý trong WebView -> bỏ qua
        return;
      }

      const { path, queryParams } = Linking.parse(url);
      console.log("📦 Parsed:", { path, queryParams });

      // Kiểm tra đúng route của VNPay
      if (path === "payment/return") {
        const status = queryParams?.status as string;
        const txnRef = queryParams?.txnRef as string;
        const amount = queryParams?.amount as string;
        const vehicleSubscriptionId =
          queryParams?.vehicleSubscriptionId as string;

        // Cập nhật context
        setPaymentResult(status === "success" ? "success" : "failed");

        // Điều hướng sang trang kết quả
        router.replace({
          pathname: "/(vnpay)/result",
          params: {
            type: type,
            status: status || "failed",
            transactionNo: txnRef || "",
            amount: amount || "",
            vehicleSubscriptionId: vehicleSubscriptionId || "",
          },
        });

        setTimeout(() => {
          resetPayment();
        }, 500);
      }
    };

    // Lắng nghe sự kiện deep link khi app đang mở
    const subscription = Linking.addEventListener("url", handleDeepLink);

    // Bắt link nếu app mở từ deep link (cold start)
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url } as Linking.EventType);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return null;
}
