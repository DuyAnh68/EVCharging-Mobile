import { useSession } from "@src/hooks/useSession";
import { router, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  Battery,
  Car,
  Clock,
  Info,
  Power,
  Zap,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Alert,
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

const SessionProcessing = () => {
  const { processingInfo } = useLocalSearchParams();
  const [session, setSession] = useState<any>(null);
  const [sessionEndInfo, setSessionEndInfo] = useState<any>(null);
  const { endSession } = useSession();

  // ✅ Parse JSON nếu processingInfo là string
  useEffect(() => {
    if (processingInfo) {
      try {
        const parsed =
          typeof processingInfo === "string"
            ? JSON.parse(processingInfo)
            : processingInfo;
        setSession(parsed);
      } catch (e) {
        console.warn("Không parse được processingInfo:", e);
      }
    }
  }, [processingInfo]);

  // 🧠 Nếu chưa có session => đang loading
  if (!session) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Đang tải thông tin phiên sạc...</Text>
      </View>
    );
  }

  const { session: data, instructions } = session;
  const batteryNow = parseInt(data?.initial_battery?.replace("%", "") || "0");
  const target = parseInt(data?.target_battery?.replace("%", "") || "100");
  const batteryToCharge = parseInt(
    data?.battery_to_charge?.replace("%", "") || "0"
  );

  const progress = Math.min(
    ((batteryNow + batteryToCharge - batteryNow) / (target - batteryNow)) * 100,
    100
  );

  // ✅ Hàm dừng sạc
  const handleEnd = async () => {
    const sessionId = data?.id;
    console.log(sessionId);
    if (!sessionId) {
      console.log("Không có session ID");
      return;
    }
    console.log("Kết thúc session:", sessionId);
    try {
      const res = await endSession(sessionId);
      if (res.success) {
        Alert.alert("End session thành công");
        router.replace({
          pathname: "/invoice",
          params: {
            invoiceData: JSON.stringify(res.data),
          },
        });
      } else {
        console.log("End session thất bại:", res.message);
      }
    } catch (error) {
      console.log("Lỗi khi end session:", error);
    }
  };

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
        <Text style={styles.headerTitle}>Phiên sạc đang diễn ra</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Card trạng thái */}
        <View style={styles.statusCard}>
          <Zap color={COLORS.primary} size={28} />
          <Text style={styles.statusText}>Đang sạc...</Text>

          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressLabel}>
            {batteryNow}% → {target}% ({data?.battery_to_charge} cần sạc)
          </Text>
        </View>

        {/* Thông tin chi tiết */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Car color={COLORS.primary} size={20} />
            <View style={styles.infoText}>
              <Text style={styles.label}>Phương tiện</Text>
              <Text style={styles.value}>
                {data?.vehicle?.model} ({data?.vehicle?.plate_number})
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Power color={COLORS.primary} size={20} />
            <View style={styles.infoText}>
              <Text style={styles.label}>Công suất trạm</Text>
              <Text style={styles.value}>
                {data?.charging_point?.power_capacity}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Clock color={COLORS.primary} size={20} />
            <View style={styles.infoText}>
              <Text style={styles.label}>Thời gian dự kiến hoàn tất</Text>
              <Text style={styles.value}>
                {new Date(
                  data?.estimated_time?.estimated_completion
                ).toLocaleTimeString("vi-VN")}
              </Text>
              <Text style={styles.subValue}>
                Khoảng {data?.estimated_time?.estimated_time} (
                {data?.estimated_time?.energy_needed})
              </Text>
            </View>
          </View>
        </View>

        {/* Giá & phí */}
        <View style={styles.priceCard}>
          <Text style={styles.priceTitle}>Chi phí dự kiến</Text>
          <Text style={styles.priceText}>
            Phí cơ bản: {data?.pricing?.base_fee}
          </Text>
          <Text style={styles.priceText}>
            Giá mỗi kWh: {data?.pricing?.price_per_kwh}
          </Text>
        </View>

        {/* Hướng dẫn */}
        <View style={styles.instructionCard}>
          <Info color={COLORS.primary} size={20} />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.instructionTitle}>Hướng dẫn</Text>
            <Text style={styles.instructionText}>
              ⚡ {instructions?.manual_stop}
            </Text>
            <Text style={styles.instructionText}>
              ⏱️ {instructions?.auto_stop}
            </Text>
          </View>
        </View>

        {/* Kết thúc phiên */}
        <TouchableOpacity style={styles.stopButton} onPress={handleEnd}>
          <Battery color="white" size={22} />
          <Text style={styles.stopText}>DỪNG SẠC</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default SessionProcessing;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
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
  scroll: {
    padding: 16,
    gap: 20,
  },
  statusCard: {
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
    marginBottom: 16,
  },
  progressBar: {
    width: "100%",
    height: 12,
    backgroundColor: "#e2e8f0",
    borderRadius: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
  },
  progressLabel: {
    marginTop: 8,
    color: COLORS.textLight,
    fontSize: 14,
  },
  infoCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 14,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    marginLeft: 12,
  },
  label: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  value: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
  },
  subValue: {
    fontSize: 13,
    color: COLORS.textLight,
  },
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
  priceText: {
    color: COLORS.textLight,
    fontSize: 14,
  },
  instructionCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  instructionTitle: {
    fontWeight: "700",
    fontSize: 15,
    color: COLORS.text,
    marginBottom: 4,
  },
  instructionText: {
    color: COLORS.textLight,
    fontSize: 14,
    marginTop: 2,
  },
  stopButton: {
    backgroundColor: "#ef4444",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    gap: 8,
    marginTop: 10,
  },
  stopText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: COLORS.textLight,
  },
});
