import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function StationsScreen() {
  const stations = [
    {
      id: 1,
      name: "EV Station Central",
      address: "123 Nguyễn Huệ, Q1, TP.HCM",
      distance: "0.5 km",
      available: 3,
      total: 4,
      price: "2,500 VNĐ/kWh",
      rating: 4.8,
    },
    {
      id: 2,
      name: "Green Energy Hub",
      address: "456 Lê Lợi, Q3, TP.HCM",
      distance: "1.2 km",
      available: 1,
      total: 6,
      price: "2,200 VNĐ/kWh",
      rating: 4.6,
    },
    {
      id: 3,
      name: "Power Charge Plaza",
      address: "789 Điện Biên Phủ, Q.Bình Thạnh, TP.HCM",
      distance: "2.1 km",
      available: 4,
      total: 8,
      price: "2,300 VNĐ/kWh",
      rating: 4.9,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Trạm sạc</Text>
        <Text style={styles.subtitle}>Tìm trạm sạc phù hợp</Text>
      </View>

      {stations.map((station) => (
        <TouchableOpacity key={station.id} style={styles.stationCard}>
          <View style={styles.stationHeader}>
            <View style={styles.stationInfo}>
              <Text style={styles.stationName}>{station.name}</Text>
              <Text style={styles.stationAddress}>{station.address}</Text>
            </View>
            <View style={styles.stationStatus}>
              <Ionicons name="location" size={16} color="#007AFF" />
              <Text style={styles.distance}>{station.distance}</Text>
            </View>
          </View>

          <View style={styles.stationDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="flash" size={16} color="#FFD700" />
              <Text style={styles.detailText}>
                {station.available}/{station.total} cổng sạc có sẵn
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="card" size={16} color="#34C759" />
              <Text style={styles.detailText}>{station.price}</Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.detailText}>{station.rating}/5.0</Text>
            </View>
          </View>

          <View style={styles.stationActions}>
            <TouchableOpacity style={styles.navigateButton}>
              <Ionicons name="navigate" size={16} color="#FFFFFF" />
              <Text style={styles.buttonText}>Chỉ đường</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.reserveButton}>
              <Ionicons name="bookmark" size={16} color="#007AFF" />
              <Text style={styles.reserveButtonText}>Đặt chỗ</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  header: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#8E8E93",
  },
  stationCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 15,
    marginVertical: 8,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  stationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  stationInfo: {
    flex: 1,
  },
  stationName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 5,
  },
  stationAddress: {
    fontSize: 14,
    color: "#8E8E93",
  },
  stationStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  distance: {
    fontSize: 14,
    color: "#007AFF",
    marginLeft: 5,
  },
  stationDetails: {
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#000000",
    marginLeft: 10,
  },
  stationActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  navigateButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    marginLeft: 5,
  },
  reserveButton: {
    backgroundColor: "#F0F8FF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  reserveButtonText: {
    color: "#007AFF",
    fontWeight: "600",
    marginLeft: 5,
  },
});
