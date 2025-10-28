import { useBooking } from "@src/hooks/useBooking";
import { COLORS } from "@src/styles/theme";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  AlertCircle,
  Calendar,
  Car,
  CheckCircle2,
  Clock,
  MapPin,
  RefreshCw,
  XCircle,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

interface StationData {
  name: string;
  address: string;
}

interface VehicleData {
  model: string;
}

interface BookingItem {
  _id: string;
  station_id?: StationData;
  vehicle_id?: VehicleData;
  start_time: string;
  end_time: string;
  status: "pending" | "completed" | "cancelled";
}

const Session = () => {
  const { getAllMyBooking } = useBooking();
  const [myBooking, setMyBooking] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMyBooking = async () => {
    try {
      const res = await getAllMyBooking();
      if (res?.success && res?.data?.bookings) {
        setMyBooking(res.data.bookings);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  useEffect(() => {
    fetchMyBooking();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMyBooking();
  };

  const Header = () => (
    <LinearGradient
      colors={[COLORS.primary, COLORS.primaryDark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.headerContainer}
    >
      <Text style={styles.headerTitle}>Phiên đặt chỗ của tôi</Text>
      <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
        <RefreshCw
          size={20}
          color="#fff"
          style={refreshing ? { opacity: 0.5 } : {}}
        />
      </TouchableOpacity>
    </LinearGradient>
  );

  const formatTime = (utcString: string) => {
    const date = new Date(utcString);
    return date.toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          color: COLORS.pending,
          icon: AlertCircle,
          bg: "#fef3c7",
          label: "Đang chờ",
        };
      case "completed":
        return {
          color: COLORS.completed,
          icon: CheckCircle2,
          bg: "#d1fae5",
          label: "Hoàn thành",
        };
      case "cancelled":
        return {
          color: COLORS.cancelled,
          icon: XCircle,
          bg: "#fee2e2",
          label: "Đã hủy",
        };
      default:
        return {
          color: COLORS.textMuted,
          icon: AlertCircle,
          bg: "#f1f5f9",
          label: status,
        };
    }
  };

  const renderItem = ({ item }: { item: BookingItem }) => {
    const statusConfig = getStatusConfig(item.status);
    const StatusIcon = statusConfig.icon;

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() =>
          router.push({
            pathname: "/sessionDetail",
            params: { bookingId: item._id },
          })
        }
      >
        <View style={styles.card}>
          <LinearGradient
            colors={["#ffffff", "#f8fafc"]}
            style={styles.cardGradient}
          >
            <View style={styles.cardHeader}>
              <View style={styles.stationInfo}>
                <View style={styles.iconBadge}>
                  <MapPin size={18} color={COLORS.primary} strokeWidth={2.5} />
                </View>
                <View style={styles.stationTexts}>
                  <Text style={styles.stationName} numberOfLines={1}>
                    {item.station_id?.name || "Trạm không xác định"}
                  </Text>
                  <Text style={styles.address} numberOfLines={2}>
                    {item.station_id?.address || "Địa chỉ không có"}
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: statusConfig.bg },
                ]}
              >
                <StatusIcon
                  size={14}
                  color={statusConfig.color}
                  strokeWidth={2.5}
                />
                <Text
                  style={[styles.statusText, { color: statusConfig.color }]}
                >
                  {statusConfig.label}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <View style={styles.detailIconWrapper}>
                  <Car size={16} color={COLORS.primary} strokeWidth={2.5} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Phương tiện</Text>
                  <Text style={styles.detailValue}>
                    {item.vehicle_id?.model || "Không xác định"}
                  </Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.detailIconWrapper}>
                  <Clock size={16} color={COLORS.secondary} strokeWidth={2.5} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Thời gian bắt đầu</Text>
                  <Text style={styles.detailValue}>
                    {formatTime(item.start_time)}
                  </Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.detailIconWrapper}>
                  <Calendar
                    size={16}
                    color={COLORS.cancelled}
                    strokeWidth={2.5}
                  />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Thời gian kết thúc</Text>
                  <Text style={styles.detailValue}>
                    {formatTime(item.end_time)}
                  </Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  if (!myBooking.length) {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.emptyIconContainer}>
          <Calendar size={64} color={COLORS.textMuted} strokeWidth={1.5} />
        </View>
        <Text style={styles.emptyTitle}>Chưa có đặt chỗ nào</Text>
        <Text style={styles.emptyText}>
          Bạn chưa có phiên đặt chỗ nào.{"\n"}Hãy bắt đầu đặt chỗ của bạn!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <FlatList
        data={myBooking}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Session;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  headerContainer: {
    height: 120,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    zIndex: 10,
    elevation: 10,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    backgroundColor: COLORS.primary,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  refreshButton: {
    padding: 8,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.15)",
  },

  listContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  card: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
      },
    }),
  },
  cardGradient: {
    padding: 16,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  stationInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    marginRight: 8,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  stationTexts: {
    flex: 1,
  },
  stationName: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  address: {
    fontSize: 13,
    color: COLORS.textLight,
    lineHeight: 18,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },
  detailsContainer: {
    gap: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 2,
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "600",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 15,
    color: COLORS.textLight,
    fontWeight: "500",
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.textLight,
    textAlign: "center",
    lineHeight: 22,
  },
});
