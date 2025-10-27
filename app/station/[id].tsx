import { Background } from "@src/components/AppBg";
import { useBooking } from "@src/hooks/useBooking";
import { useStation } from "@src/hooks/useStation";
import { useVehicle } from "@src/hooks/useVehicle";
import { router, useLocalSearchParams } from "expo-router";
import { Circle, Gauge, MapPin, Plug, Zap } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function StationDetail() {
  const { id } = useLocalSearchParams();
  const { getStationById, getChargingPoints } = useStation();
  const { getVehicles } = useVehicle();
  const { getAllBookingsFilterChargingPoints } = useBooking();

  const [station, setStation] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [chargingPoints, setChargingPoints] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedPort, setSelectedPort] = useState(null);
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const [stationRes, vehicleRes, chargingRes, bookingRes] =
        await Promise.all([
          getStationById(id),
          getVehicles(),
          getChargingPoints(id),
          getAllBookingsFilterChargingPoints(selectedPort?._id),
        ]);
      if (stationRes?.success) setStation(stationRes.station);
      if (vehicleRes?.success) setVehicles(vehicleRes.vehicles);
      if (chargingRes?.success) setChargingPoints(chargingRes.chargingPoints);
      if (bookingRes?.success) setBooking(bookingRes.data);
    };
    fetchData();
  }, [id, selectedPort]);

  if (!station || !chargingPoints)
    return <Text style={styles.loading}>Đang tải thông tin trạm...</Text>;

  const { name, address, power_capacity, connector_type, status } =
    station.station;

  // Trạng thái trạm
  const isOnline = status === "online";

  const onlinePoints =
    chargingPoints.online_charging_points?.details?.available || [];
  const offlinePoints =
    chargingPoints.offline_charging_points?.details?.available || [];

  return (
    <Background>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.address}>
            <MapPin color="#fff" size={16} /> {address}
          </Text>
        </View>

        {/* Station Info */}
        <View style={styles.card}>
          <View style={styles.row}>
            <Zap color="#10B981" size={20} />
            <Text style={styles.label}>Loại đầu nối:</Text>
            <Text style={styles.value}>{connector_type}</Text>
          </View>
          <View style={styles.row}>
            <Gauge color="#10B981" size={20} />
            <Text style={styles.label}>Công suất trạm:</Text>
            <Text style={styles.value}>{power_capacity} kW</Text>
          </View>
          <View style={styles.row}>
            <Circle color={isOnline ? "#10B981" : "#EF4444"} size={20} />
            <Text style={styles.label}>Trạng thái:</Text>
            <Text
              style={[
                styles.value,
                { color: isOnline ? "#10B981" : "#EF4444" },
              ]}
            >
              {isOnline ? "Hoạt động" : "Ngoại tuyến"}
            </Text>
          </View>
        </View>

        {/* Charging Points */}
        <View style={styles.subCard}>
          <Text style={styles.subTitle}>Điểm sạc khả dụng</Text>
          {onlinePoints.length === 0 && offlinePoints.length === 0 ? (
            <Text style={styles.noPoints}>Không có điểm sạc nào khả dụng</Text>
          ) : (
            <View style={styles.portList}>
              {onlinePoints.map((p, idx) => (
                <TouchableOpacity
                  key={p?._id}
                  style={[
                    styles.portItem,
                    selectedPort?._id === p?._id && styles.portSelected,
                  ]}
                  onPress={() => setSelectedPort(p)}
                >
                  <Plug color="#059669" size={18} />
                  <Text style={styles.portLabel}>
                    Online #{idx + 1} ({p.status})
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Vehicles */}
        <View style={styles.subCard}>
          <Text style={styles.subTitle}>Chọn xe để sạc</Text>

          {vehicles.length === 0 ? (
            <Text style={styles.noPoints}>Bạn chưa có xe nào.</Text>
          ) : (
            vehicles.map((v) => (
              <TouchableOpacity
                key={v.id}
                style={[
                  styles.vehicleItem,
                  selectedVehicle?.id === v.id && styles.vehicleItemSelected,
                ]}
                onPress={() => setSelectedVehicle(v)}
              >
                <View>
                  <Text style={styles.vehiclePlate}>{v.plateNumber}</Text>
                  <Text style={styles.vehicleModel}>{v.model}</Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={styles.vehicleBattery}>
                    🔋 {v.batteryCapacity} kW
                  </Text>
                  <Text style={styles.vehiclePlan}>
                    {v.subscription
                      ? `Gói: ${v.subscription.status}`
                      : "Chưa có gói"}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor:
                selectedVehicle && selectedPort ? "#059669" : "#9CA3AF",
            },
          ]}
          disabled={!selectedVehicle || !selectedPort}
          onPress={() => {
            // chuyển sang trang xác nhận booking
            router.push({
              pathname: "/booking",
              params: {
                stationId: station.station._id,
                vehicleId: selectedVehicle.id,
                booking: JSON.stringify(booking.bookings),
                chargingPoint: selectedPort?._id,
              },
            });
          }}
        >
          <Plug color="#fff" size={18} />
          <Text style={styles.buttonText}>Chọn giờ sạc</Text>
        </TouchableOpacity>
      </ScrollView>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "transparent" },
  header: {
    backgroundColor: "#3CB371",
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  title: { fontSize: 20, fontWeight: "700", color: "#fff", marginBottom: 4 },
  address: { fontSize: 14, color: "#e0ffe3" },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
  },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  label: { marginLeft: 8, fontSize: 15, color: "#333", flex: 1 },
  value: { fontWeight: "600", fontSize: 15, color: "#111" },
  subCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 16,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#00C851",
    marginBottom: 10,
  },
  portList: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  portItem: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  portLabel: { marginLeft: 6, fontSize: 13, color: "#333" },
  portSelected: { backgroundColor: "#DCFCE7", borderColor: "#059669" },
  vehicleItem: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 12,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  vehicleItemSelected: { borderColor: "#059669", backgroundColor: "#ECFDF5" },
  vehiclePlate: { fontWeight: "700", fontSize: 15, color: "#111" },
  vehicleModel: { fontSize: 13, color: "#666" },
  vehicleBattery: { fontSize: 13, color: "#10B981" },
  vehiclePlan: { fontSize: 12, color: "#888" },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginHorizontal: 16,
    borderRadius: 12,
    marginTop: 16,
    gap: 6,
    marginBottom: 50,
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  noPoints: { color: "#666", fontSize: 13 },
  loading: { textAlign: "center", marginTop: 50, color: "#666" },
});
