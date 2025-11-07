import { usePayment } from "@src/context/PaymentContext";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function VNPaySubscriptionReturn() {
  const { status, vehicleSubscriptionId } = useLocalSearchParams<{
    status?: string;
    vehicleSubscriptionId?: string;
  }>();

  const { setPaymentResult } = usePayment();

  useEffect(() => {
    if (status === "success") setPaymentResult("success");
    else setPaymentResult("failed");

    const timer = setTimeout(() => {
      router.push("/(tabs)/vehicle");
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const isSuccess = status === "success";

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isSuccess ? "#E6FFFA" : "#FFE6E6" },
      ]}
    >
      <Text
        style={[styles.emoji, { color: isSuccess ? "#10B981" : "#EF4444" }]}
      >
        {isSuccess ? "✅" : "❌"}
      </Text>
      <Text
        style={[styles.title, { color: isSuccess ? "#047857" : "#B91C1C" }]}
      >
        {isSuccess ? "Thanh toán thành công!" : "Thanh toán thất bại"}
      </Text>

      {isSuccess && vehicleSubscriptionId ? (
        <Text style={styles.subText}>
          Mã đăng ký: <Text style={styles.bold}>{vehicleSubscriptionId}</Text>
        </Text>
      ) : (
        <Text style={styles.subText}>Vui lòng thử lại giao dịch.</Text>
      )}

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: isSuccess ? "#10B981" : "#EF4444" },
        ]}
        onPress={() => router.push("/(tabs)/vehicle")}
      >
        <Text style={styles.buttonText}>Quay lại</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emoji: { fontSize: 60, marginBottom: 12 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  subText: { fontSize: 16, color: "#374151", textAlign: "center" },
  bold: { fontWeight: "600" },
  button: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "500" },
});
