import { Station } from "@src/types/station";
import { DollarSign, MapPin, Navigation, X, Zap } from "lucide-react-native";
import { useState } from "react";
import {
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

interface stationsType {
  stations: Station[];
}

const StationsMap = ({ stations }: stationsType) => {
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);

  const openNavigation = (station: Station) => {
    const scheme = Platform.select({
      ios: "maps://0,0?q=",
      android: "geo:0,0?q=",
      web: "https://www.google.com/maps/search/?api=1&query=",
    });

    const label = encodeURIComponent(station.name);
    const url = Platform.select({
      ios: `${scheme}${station.latitude},${station.longitude}&ll=${station.latitude},${station.longitude}`,
      android: `${scheme}${station.latitude},${station.longitude}(${label})`,
      web: `${scheme}${station.latitude},${station.longitude}`,
    });

    Linking.openURL(url || "");
  };

  const getMarkerColor = (station: Station) => {
    if (station.status === "offline") return "#9CA3AF";
    return station.connector_type === "DC" ? "#10B981" : "#3B82F6";
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 10.8231,
          longitude: 106.6297,
          latitudeDelta: 5,
          longitudeDelta: 5,
        }}
      >
        {stations.map((station) => (
          <Marker
            key={station.name}
            coordinate={{
              latitude: station.latitude,
              longitude: station.longitude,
            }}
            title={station.name}
            description={station.address}
            pinColor={getMarkerColor(station)}
            onPress={() => setSelectedStation(station)}
          />
        ))}
      </MapView>

      <Modal
        visible={!!selectedStation}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedStation(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Thông tin trạm sạc</Text>
              <TouchableOpacity
                onPress={() => setSelectedStation(null)}
                style={styles.closeButton}
              >
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {selectedStation && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.stationHeader}>
                  <Text style={styles.stationName}>{selectedStation.name}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          selectedStation.status === "online"
                            ? "#D1FAE5"
                            : "#FEE2E2",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        {
                          color:
                            selectedStation.status === "online"
                              ? "#059669"
                              : "#DC2626",
                        },
                      ]}
                    >
                      {selectedStation.status === "online"
                        ? "Đang hoạt động"
                        : "Ngừng hoạt động"}
                    </Text>
                  </View>
                </View>

                <View style={styles.infoSection}>
                  <View style={styles.infoRow}>
                    <MapPin size={20} color="#6B7280" />
                    <Text style={styles.infoText}>
                      {selectedStation.address}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Zap size={20} color="#F59E0B" />
                    <Text style={styles.infoText}>
                      {selectedStation.connector_type} -{" "}
                      {selectedStation.power_capacity}kW
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <DollarSign size={20} color="#10B981" />
                    <View style={styles.priceInfo}>
                      <Text style={styles.infoText}>
                        Giá: {formatPrice(selectedStation.price_per_kwh)}/kWh
                      </Text>
                      <Text style={styles.infotextSecondary}>
                        Phí cơ bản: {formatPrice(selectedStation.base_fee)}
                      </Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.navigationButton}
                  onPress={() => openNavigation(selectedStation)}
                >
                  <Navigation size={20} color="#FFFFFF" />
                  <Text style={styles.navigationButtonText}>Chỉ đường</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#52C49E",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  stationHeader: {
    marginBottom: 20,
  },
  stationName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  infoSection: {
    gap: 16,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  infoText: {
    fontSize: 15,
    color: "#374151",
    flex: 1,
    lineHeight: 22,
  },
  priceInfo: {
    flex: 1,
    gap: 4,
  },
  infotextSecondary: {
    fontSize: 13,
    color: "#6B7280",
  },
  navigationButton: {
    backgroundColor: "#52C49E",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  navigationButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
export default StationsMap;
