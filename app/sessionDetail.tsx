import { useBooking } from "@src/hooks/useBooking";
import { useSession } from "@src/hooks/useSession";
import * as Clipboard from "expo-clipboard";
import { router, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  Car,
  Clock,
  MapPin,
  QrCode,
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
import QRCode from "react-native-qrcode-svg";

const COLORS = {
  primary: "#2563eb",
  background: "#f8fafc",
  cardBg: "#ffffff",
  text: "#1e293b",
  textLight: "#64748b",
  border: "#e2e8f0",
};

const SessionDetail = () => {
  const [session, setSession] = useState<any>(null);
  const { bookingId } = useLocalSearchParams();
  const { generateQR } = useSession();
  const { getBookingById } = useBooking();
  const [booking, setBooking] = useState<any>(null);
  const { startSession } = useSession();

  const generateQRForSession = async () => {
    try {
      const res = await generateQR(bookingId);
      if (res.success) {
        setSession(res.data);
      } else {
        Alert.alert("Không thể tạo mã QR");
      }
    } catch (error) {
      Alert.alert("Lỗi khi tạo QR");
    }
  };
  const getBooking = async () => {
    const res = await getBookingById(bookingId);
    if (res.success) {
      setBooking(res.data);
    }
  };

  useEffect(() => {
    generateQRForSession();
    getBooking();
  }, [bookingId]);
  console.log(session);
  console.log(booking);

  if (!session) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Đang tải phiên sạc...</Text>
      </View>
    );
  }

  const handleStartSession = async () => {
    if (!session?.qr_code_token) {
      Alert.alert("Thiếu mã QR token");
      return;
    }
    const min = 0;
    const max = 99;

    const number = Math.floor(Math.random() * (max - min + 1)) + min;
    const initialBattery = number;
    console.log("initial:", initialBattery);

    const res = await startSession(session.qr_code_token, initialBattery);
    console.log("start", res.data);
    if (res.success) {
      Alert.alert("Thành công", "Phiên sạc đã được bắt đầu!");
      router.push({
        pathname: "/sessionProcessing",
        params: { processingInfo: JSON.stringify(res.data) },
      });
    } else {
      Alert.alert("Thất bại", res.message);
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
        <Text style={styles.headerTitle}>Chi tiết phiên sạc</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.qrContainer}>
            <QRCode
              value={session.qr_url}
              size={180}
              color={COLORS.primary}
              backgroundColor="white"
            />
          </View>
          <Text style={styles.qrLabel}>
            Quét mã này tại trạm để bắt đầu sạc
          </Text>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <MapPin color={COLORS.primary} size={20} />
            <View style={styles.infoText}>
              <Text style={styles.label}>Trạm sạc</Text>
              <Text style={styles.value}>
                {booking?.station_id?.name || "Không xác định"}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Car color={COLORS.primary} size={20} />
            <View style={styles.infoText}>
              <Text style={styles.label}>Phương tiện</Text>
              <Text style={styles.value}>
                {booking?.vehicle_id.model || "Không xác định"}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <QrCode color={COLORS.primary} size={20} />
            <View style={styles.infoText}>
              <Text style={styles.label}>Mã phiên</Text>
              <TouchableOpacity
                onPress={() => Clipboard.setStringAsync(session.qr_code_token)}
              >
                <Text style={styles.value}>{session.qr_code_token}</Text>
              </TouchableOpacity>
              <Text>Ấn để sao chép</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Clock color={COLORS.primary} size={20} />
            <View style={styles.infoText}>
              <Text style={styles.label}>Trạng thái</Text>
              <Text style={styles.value}>Đang chờ bắt đầu</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartSession}
        >
          <Zap color="white" size={22} />
          <Text style={styles.startButtonText}>BẮT ĐẦU SẠC</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default SessionDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  startButton: {
    marginTop: 30,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    gap: 8,
  },
  startButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
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
  scrollContent: {
    padding: 16,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  qrContainer: {
    marginBottom: 16,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  qrLabel: {
    fontSize: 15,
    color: COLORS.textLight,
    fontWeight: "500",
  },
  infoCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 20,
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
    marginBottom: 2,
  },
  value: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textLight,
  },
});
