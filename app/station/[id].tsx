import { Background } from "@src/components/AppBg";
import { useStation } from "@src/hooks/useStation";
import { router, useLocalSearchParams } from "expo-router";
import { Gauge, MapPin, Navigation, Plug, Zap } from "lucide-react-native";
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
  const { getStationById } = useStation();
  const [station, setStation] = useState(null);

  useEffect(() => {
    const fetchStation = async () => {
      const res = await getStationById(id);
      if (res?.success) {
        setStation(res.station);
      }
    };
    fetchStation();
  }, [id]);

  if (!station)
    return <Text style={styles.loading}>Đang tải thông tin...</Text>;

  const { name, address, latitude, longitude, connector_type, power_capacity } =
    station?.station || {};

  return (
    <Background>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.address}>
            <MapPin color="#fff" size={16} /> {address}
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.row}>
            <Zap color="#00C851" size={20} />
            <Text style={styles.label}>Loại đầu nối:</Text>
            <Text style={styles.value}>{connector_type}</Text>
          </View>

          <View style={styles.row}>
            <Gauge color="#00C851" size={20} />
            <Text style={styles.label}>Công suất trạm:</Text>
            <Text style={styles.value}>{power_capacity} kW</Text>
          </View>

          <View style={styles.row}>
            <Plug color="#00C851" size={20} />
            <Text style={styles.label}>Tổng điểm sạc:</Text>
            <Text style={styles.value}>{station?.charging_points.total}</Text>
          </View>
        </View>

        <View style={styles.subCard}>
          <Text style={styles.subTitle}>Trạng thái trạm</Text>

          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Online:</Text>
            <Text style={styles.statusValue}>
              {station?.charging_points?.online?.available} khả dụng /{" "}
              {station?.charging_points?.online?.total} tổng
            </Text>
          </View>

          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Offline:</Text>
            <Text style={styles.statusValue}>
              {station?.charging_points?.offline?.available} khả dụng /{" "}
              {station?.charging_points?.offline?.total} tổng
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            router.push({
              pathname: "/map",
              params: { lat: latitude, lon: longitude },
            })
          }
        >
          <Navigation color="#fff" size={18} />
          <Text style={styles.buttonText}>Chỉ đường đến trạm</Text>
        </TouchableOpacity>
      </ScrollView>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  header: {
    backgroundColor: "#3CB371",
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: "#e0ffe3",
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    marginLeft: 8,
    fontSize: 15,
    color: "#333",
    flex: 1,
  },
  value: {
    fontWeight: "600",
    fontSize: 15,
    color: "#111",
  },
  subCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#00C851",
    marginBottom: 10,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  statusLabel: {
    fontSize: 14,
    color: "#333",
  },
  statusValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
  },
  button: {
    backgroundColor: "#059669",
    marginHorizontal: 16,
    marginVertical: 20,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  loading: {
    textAlign: "center",
    marginTop: 50,
    color: "#666",
  },
});
