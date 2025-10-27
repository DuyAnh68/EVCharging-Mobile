import { useStation } from "@src/hooks/useStation";
import { Station } from "@src/types/station";
import { router } from "expo-router";
import {
  Circle,
  DollarSign,
  MapPin,
  Navigation,
  Zap,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  FlatList,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const { getStations } = useStation();
  const [stations, setStations] = useState<Station[]>([]);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const res = await getStations();
        if (res?.success) {
          setStations(res?.stations);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchStations();
  }, []);

  const openNavigation = (station: Station) => {
    const scheme = Platform.select({
      ios: "maps://0,0?q=",
      android: "geo:0,0?q=",
    });

    const label = encodeURIComponent(station.name);
    const url = Platform.select({
      ios: `${scheme}${station.latitude},${station.longitude}&ll=${station.latitude},${station.longitude}`,
      android: `${scheme}${station.latitude},${station.longitude}(${label})`,
    });

    Linking.openURL(url || "");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const renderStationItem = ({ item }: { item: Station }) => {
    const isOnline = item.status === "online";

    return (
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/station/[id]",
            params: { id: item._id },
          })
        }
      >
        <View style={styles.stationCard}>
          <View style={styles.cardHeader}>
            <View style={styles.headerLeft}>
              <Text style={styles.stationName}>{item.name}</Text>
              <View style={styles.statusContainer}>
                <Circle
                  size={8}
                  color={isOnline ? "#10B981" : "#EF4444"}
                  fill={isOnline ? "#10B981" : "#EF4444"}
                />
                <Text
                  style={[
                    styles.statusText,
                    { color: isOnline ? "#10B981" : "#EF4444" },
                  ]}
                >
                  {isOnline ? "Hoạt động" : "Ngừng"}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => openNavigation(item)}
            >
              <Navigation size={20} color="#3B82F6" />
            </TouchableOpacity>
          </View>

          <View style={styles.cardBody}>
            <View style={styles.infoRow}>
              <MapPin size={16} color="#6B7280" />
              <Text style={styles.infoText} numberOfLines={2}>
                {item.address}
              </Text>
            </View>

            <View style={styles.detailsRow}>
              <View style={styles.detailItem}>
                <Zap size={16} color="#F59E0B" />
                <Text style={styles.detailText}>
                  {item.connector_type} - {item.power_capacity}kW
                </Text>
              </View>

              <View style={styles.detailItem}>
                <DollarSign size={16} color="#10B981" />
                <Text style={styles.detailText}>
                  {formatPrice(item.price_per_kwh)}/kWh
                </Text>
              </View>
            </View>

            <View style={styles.feeRow}>
              <Text style={styles.feeLabel}>Phí cơ bản:</Text>
              <Text style={styles.feeValue}>{formatPrice(item.base_fee)}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Trạm sạc điện</Text>
        <Text style={styles.headerSubtitle}>
          {stations.length} trạm sạc khả dụng
        </Text>
      </View>
      <FlatList
        data={stations}
        renderItem={renderStationItem}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
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
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#E0F2E9",
    marginTop: 4,
  },
  listContainer: {
    padding: 16,
  },
  stationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#D6EADF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  stationName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 6,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#10B981",
  },
  navButton: {
    backgroundColor: "#E0F2E9",
    padding: 8,
    borderRadius: 10,
  },
  cardBody: {
    marginTop: 10,
    gap: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
  },
  feeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  feeLabel: {
    fontSize: 13,
    color: "#6B7280",
  },
  feeValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
});
