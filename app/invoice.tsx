import { router, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  Battery,
  Car,
  Clock,
  CreditCard,
  Zap,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const COLORS = {
  primary: "#2563eb",
  background: "#f8fafc",
  cardBg: "#ffffff",
  text: "#1e293b",
  textLight: "#64748b",
  border: "#e2e8f0",
  success: "#16a34a",
};

export default function InvoiceScreen() {
  const { invoiceData } = useLocalSearchParams();
  const [invoice, setInvoice] = useState<any>(null);
  console.log(invoiceData);

  // Parse JSON nếu được truyền từ router
  useEffect(() => {
    if (invoiceData) {
      try {
        const parsed =
          typeof invoiceData === "string"
            ? JSON.parse(invoiceData)
            : invoiceData;
        setInvoice(parsed);
      } catch (err) {
        console.warn("Không parse được invoiceData:", err);
      }
    }
  }, [invoiceData]);

  if (!invoice) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Đang tải hóa đơn...</Text>
      </View>
    );
  }

  const { fee_calculation, session, payment_data, target_status, message } =
    invoice;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={22} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hóa đơn sạc</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Card tổng kết */}
        <View style={styles.summaryCard}>
          <Zap size={28} color={COLORS.primary} />
          <Text style={styles.statusText}>
            {message || "Phiên sạc đã hoàn tất"}
          </Text>
          <Text style={styles.targetStatus}>{target_status}</Text>
        </View>

        {/* Thông tin phiên */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Car color={COLORS.primary} size={20} />
            <View style={styles.infoText}>
              <Text style={styles.label}>Dung lượng pin</Text>
              <Text style={styles.value}>{session?.battery_capacity}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Battery color={COLORS.primary} size={20} />
            <View style={styles.infoText}>
              <Text style={styles.label}>Mức pin</Text>
              <Text style={styles.value}>
                {session?.initial_battery} → {session?.final_battery}
              </Text>
              <Text style={styles.subValue}>
                Sạc được {session?.energy_delivered}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Clock color={COLORS.primary} size={20} />
            <View style={styles.infoText}>
              <Text style={styles.label}>Thời gian</Text>
              <Text style={styles.value}>
                {new Date(session?.start_time).toLocaleTimeString("vi-VN")} -{" "}
                {new Date(session?.end_time).toLocaleTimeString("vi-VN")}
              </Text>
              <Text style={styles.subValue}>{session?.duration}</Text>
            </View>
          </View>
        </View>

        {/* Phí sạc */}
        <View style={styles.priceCard}>
          <Text style={styles.priceTitle}>Chi tiết chi phí</Text>
          <Text style={styles.priceLine}>
            ⚙️ Phí cơ bản: {fee_calculation?.base_fee_formatted}
          </Text>
          <Text style={styles.priceLine}>
            ⚡ Giá mỗi kWh: {fee_calculation?.price_per_kwh} VND
          </Text>
          <Text style={styles.priceLine}>
            🔋 Điện tiêu thụ: {fee_calculation?.energy_charged}
          </Text>
          <Text style={styles.priceLine}>
            🧾 Chi tiết: {fee_calculation?.breakdown}
          </Text>

          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Tổng cộng</Text>
            <Text style={styles.totalValue}>
              {fee_calculation?.total_amount_formatted}
            </Text>
          </View>
        </View>

        {/* Thanh toán */}
        <View style={styles.paymentCard}>
          <CreditCard color={COLORS.primary} size={22} />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.paymentTitle}>Thanh toán</Text>
            <Text style={styles.paymentText}>
              Mã phiên: {payment_data?.session_id}
            </Text>
            <Text style={styles.paymentText}>
              Số tiền: {payment_data?.amount} VND
            </Text>
          </View>
        </View>

        {/* Nút hoàn tất */}
        <TouchableOpacity
          style={styles.doneButton}
          onPress={() => router.replace("/")}
        >
          <Text style={styles.doneText}>HOÀN TẤT</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 14,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
  scroll: { padding: 16, gap: 20 },

  summaryCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statusText: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: 10,
  },
  targetStatus: { color: COLORS.textLight, fontSize: 14, marginTop: 4 },

  infoCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 14,
  },
  infoRow: { flexDirection: "row", alignItems: "center" },
  infoText: { marginLeft: 12 },
  label: { fontSize: 13, color: COLORS.textLight },
  value: { fontSize: 15, fontWeight: "600", color: COLORS.text },
  subValue: { fontSize: 13, color: COLORS.textLight },

  priceCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  priceTitle: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 8,
    color: COLORS.text,
  },
  priceLine: { color: COLORS.textLight, fontSize: 14, marginBottom: 2 },

  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
  },
  totalLabel: { fontWeight: "700", color: COLORS.text },
  totalValue: { fontWeight: "700", color: COLORS.success, fontSize: 16 },

  paymentCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
  },
  paymentTitle: {
    fontWeight: "700",
    fontSize: 15,
    color: COLORS.text,
    marginBottom: 4,
  },
  paymentText: { color: COLORS.textLight, fontSize: 14 },

  doneButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  doneText: { color: "white", fontSize: 16, fontWeight: "700" },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { color: COLORS.textLight },
});
