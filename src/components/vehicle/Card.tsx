import {
  Entypo,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { COLORS, TEXTS } from "@src/styles/theme";
import { VehicleDetail } from "@src/types/vehicle";
import { formatDateTime } from "@src/utils/formatData";
import { useEffect, useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface CardProps {
  vehicle: VehicleDetail;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function VehicleCard({
  vehicle,
  onPress,
  onEdit,
  onDelete,
}: CardProps) {
  // State
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const hasCompany = vehicle.company;

  // UseEffect
  useEffect(() => {
    if (vehicle.subscription) {
      const { date: startDateFormatted } = formatDateTime(
        vehicle.subscription.startDate
      );
      const { date: endDateFormatted } = formatDateTime(
        vehicle.subscription.endDate
      );

      setStartDate(startDateFormatted);
      setEndDate(endDateFormatted);
    } else {
      setStartDate("");
      setEndDate("");
    }
  }, [vehicle.subscription]);

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={onPress}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="car-sport" size={24} color={COLORS.white} />
          </View>

          <View style={styles.headerInfo}>
            <Text style={styles.plateNumber}>{vehicle.plateNumber}</Text>
            <Text style={styles.model}>{vehicle.model}</Text>
          </View>

          {!hasCompany && (
            <View style={styles.actions}>
              <TouchableOpacity
                onPress={onEdit}
                style={[
                  styles.actionButton,
                  { backgroundColor: COLORS.green50 },
                ]}
              >
                <MaterialCommunityIcons
                  name="pencil-outline"
                  size={18}
                  color={COLORS.primary}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onDelete}
                style={[
                  styles.actionButton,
                  { backgroundColor: COLORS.dangerLight },
                ]}
              >
                <Ionicons
                  name="trash-outline"
                  size={18}
                  color={COLORS.danger}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.infoRow}>
          <View style={[styles.infoItem, { alignItems: "center" }]}>
            <FontAwesome name="battery-full" size={20} color={COLORS.primary} />
            <Text style={styles.infoText}>{vehicle.batteryCapacity} kWh</Text>
          </View>
          {vehicle.company && (
            <View style={[styles.infoItem, { alignItems: "flex-end" }]}>
              <Ionicons name="business" size={20} color={COLORS.secondary} />
              <Text style={styles.infoText} numberOfLines={1}>
                {vehicle.company.name}
              </Text>
            </View>
          )}
        </View>

        {vehicle.subscription && (
          <View style={styles.subscriptionContainer}>
            <View style={styles.divider} />
            <View style={styles.subscriptionInfo}>
              <View style={styles.subscriptionRow}>
                <Text style={styles.planName}>
                  {vehicle.subscription.plan.name}
                </Text>
              </View>
              <View style={styles.dateRow}>
                <Entypo name="calendar" size={14} color={COLORS.gray600} />
                <Text style={styles.dateText}>
                  {startDate} - {endDate}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 16,
    elevation: 6,
    overflow: Platform.OS === "ios" ? "visible" : "hidden",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    backgroundColor: COLORS.white,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  model: {
    fontSize: 14,
    color: TEXTS.secondary,
  },
  headerInfo: {
    flex: 1,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  plateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  plateNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: TEXTS.primary,
  },
  activeBadge: {
    backgroundColor: COLORS.successLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.successDark,
  },
  expiredBadge: {
    backgroundColor: COLORS.dangerLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  expiredBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.dangerDark,
  },
  noSubBadge: {
    backgroundColor: COLORS.inactiveLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  noSubBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.inactiveDark,
  },
  modelText: {
    fontSize: 16,
    fontWeight: "500",
    color: TEXTS.primary,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    gap: 16,
  },
  infoItem: {
    flexDirection: "row",
    gap: 6,
    flex: 1,
  },
  infoText: {
    fontSize: 14,
    color: TEXTS.secondary,
    flex: 1,
  },
  subscriptionContainer: {
    marginTop: 16,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.green200,
    marginBottom: 12,
  },
  subscriptionInfo: {
    gap: 8,
  },
  subscriptionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  planName: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },
  planPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: TEXTS.primary,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dateText: {
    fontSize: 13,
    color: TEXTS.secondary,
  },
});
