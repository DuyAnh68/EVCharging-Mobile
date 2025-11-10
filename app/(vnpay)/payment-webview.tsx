import { Ionicons } from "@expo/vector-icons";
import { usePayment } from "@src/context/PaymentContext";
import { COLORS, TEXTS } from "@src/styles/theme";
import * as Linking from "expo-linking";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { WebView } from "react-native-webview";

export default function PaymentWebView() {
  const { type, returnPath } = useLocalSearchParams<{
    type: "createSub" | "updateSub" | "charging_fee" | "booking";
    returnPath?: string;
  }>();
  // Use Ref
  const webviewRef = useRef<any>(null);

  // Hook
  const { paymentUrl, setPaymentResult, resetPayment, setIsBack } =
    usePayment();

  // Handle logic
  const handleClose = () => {
    setIsBack(true);
    router.back();
    resetPayment();
  };

  const handleVNPayReturn = (url: string) => {
    // console.log("🔗 Intercepted deep link:", url);

    const { path, queryParams } = Linking.parse(url);
    // console.log("📦 Parsed:", { path, queryParams });

    // Một số máy parse path thành "return" thay vì "payment/return"
    if (path === "return" || path === "payment/return") {
      const status = queryParams?.status as string;
      const txnRef = queryParams?.txnRef as string;
      const amount = queryParams?.amount as string;
      const vehicleSubscriptionId =
        queryParams?.vehicleSubscriptionId as string;

      setPaymentResult(status === "success" ? "success" : "failed");

      router.replace({
        pathname: "/(vnpay)/result",
        params: {
          type: type ?? "",
          status: status || "failed",
          transactionNo: txnRef || "",
          amount: amount || "",
          vehicleSubscriptionId: vehicleSubscriptionId || "",
        },
      });

      return true;
    }

    return false;
  };

  // Check
  const shouldIntercept = (url: string) => {
    if (url.startsWith("evchargingapp://")) {
      handleVNPayReturn(url);
      return false;
    }
    return true;
  };

  // Use Effect
  useEffect(() => {
    return () => {
      resetPayment();
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={styles.headerSection}>
        <Text style={styles.title}>Thanh toán VNPay</Text>

        <TouchableOpacity style={styles.backContainer} onPress={handleClose}>
          <Ionicons name="chevron-back" size={25} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {paymentUrl ? (
        <WebView
          ref={webviewRef}
          source={{ uri: paymentUrl }}
          startInLoadingState
          javaScriptEnabled
          domStorageEnabled
          cacheEnabled={false}
          originWhitelist={["*"]}
          allowsInlineMediaPlayback
          mixedContentMode="always"
          onShouldStartLoadWithRequest={(request) =>
            shouldIntercept(request.url)
          }
          onNavigationStateChange={(navState) => {
            const url = navState.url;
            if (url.startsWith("evchargingapp://")) {
              shouldIntercept(url);
            }
          }}
          onError={(e) => {
            const err = e.nativeEvent;
            // Ẩn lỗi redirect không cần thiết
            if (
              err.description?.includes(
                "Redirection to URL with a scheme that is not HTTP"
              )
            ) {
              console.log(
                "⚠️ Ignored harmless redirect error:",
                err.description
              );
              return;
            }
            console.error("❌ WebView error:", err);
          }}
        />
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Không tìm thấy URL thanh toán</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerSection: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 12,
    backgroundColor: COLORS.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: TEXTS.white,
    marginBottom: 4,
    textAlign: "center",
  },
  backContainer: {
    position: "absolute",
    zIndex: 10,
    justifyContent: "center",
    alignItems: "center",
    bottom: 18,
    left: 10,
  },
});
