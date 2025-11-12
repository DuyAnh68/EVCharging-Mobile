import { Entypo, Ionicons } from "@expo/vector-icons";
import InvoiceInfo from "@src/components/history/invoice/InvoiceInfo";
import { COLORS, TEXTS } from "@src/styles/theme";
import type { Invoice } from "@src/types/invoice";
import { calcSecondsToDuration } from "@src/utils/calculateData";
import { formatDateTime, formatRoundedAmount } from "@src/utils/formatData";
import {
  getPaymentStatusColor,
  getPaymentStatusLabel,
} from "@src/utils/getHelper";
import type React from "react";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CardProps {
  invoice: Invoice;
  onPress?: (id: string) => void;
  isPayment?: boolean;
  isSelected?: boolean;
}

export const Card: React.FC<CardProps> = ({
  invoice,
  onPress,
  isPayment = false,
  isSelected = false,
}) => {
  // State
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");

  // Get
  const statusColor = getPaymentStatusColor(invoice.paymentStatus);
  const statusLabel = getPaymentStatusLabel(invoice.paymentStatus);

  // Check
  const isActive = invoice.vehicle.isActive;

  // Use Effect
  useEffect(() => {
    const { date: dateFormatted, time: timeFormatted } = formatDateTime(
      invoice.createdAt
    );

    setDate(dateFormatted);
    setTime(timeFormatted);
  }, [invoice]);

  return (
    <TouchableOpacity
      style={[styles.card, isPayment && isSelected && styles.cardSelected]}
      onPress={() => onPress?.(invoice.id)}
      activeOpacity={0.8}
    >
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <View style={styles.iconContainer}>
            <Ionicons name="car-sport" size={24} color={COLORS.white} />
          </View>
          <View>
            <Text style={styles.plateNumber}>
              {invoice.vehicle.plateNumber}
            </Text>
            <Text style={styles.model}>{invoice.vehicle.model}</Text>
          </View>
        </View>

        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: `${statusColor}20` },
            ]}
          >
            <View
              style={[styles.statusDot, { backgroundColor: statusColor }]}
            />
            <Text style={[styles.statusText, { color: statusColor }]}>
              {statusLabel}
            </Text>
          </View>

          {!isActive && (
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: COLORS.danger + "20",
                },
              ]}
            >
              <View
                style={[styles.statusDot, { backgroundColor: COLORS.danger }]}
              />
              <Text style={[styles.statusText, { color: COLORS.danger }]}>
                Xe bị xóa
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Date and Time */}
      <View style={styles.dateTimeSection}>
        <View style={styles.dateTimeIcon}>
          <Entypo name="calendar" size={16} color={COLORS.gray600} />
        </View>
        <View>
          <Text style={styles.date}>{date}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Invoice Info Grid */}
      <View style={styles.infoGrid}>
        <InvoiceInfo
          label="Pin"
          value={invoice.batteryCharged}
          icon="battery-charging-sharp"
          color={COLORS.success}
        />
        <InvoiceInfo
          label="Thời lượng sạc"
          value={calcSecondsToDuration(invoice.duration)}
          icon="time"
          color={COLORS.black}
        />
        <InvoiceInfo
          label="Trạm sạc"
          value={invoice.station}
          icon="location"
          color={COLORS.info}
        />
        <InvoiceInfo
          label="Tổng tiền"
          value={formatRoundedAmount(invoice.totalAmount, { asString: true })}
          icon="card"
          color={COLORS.warning}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  cardSelected: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primaryDarker,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  plateNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: TEXTS.primary,
    marginBottom: 2,
  },
  model: {
    fontSize: 13,
    color: TEXTS.secondary,
    fontWeight: "500",
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
  statusContainer: {
    gap: 3,
    alignItems: "flex-end",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.green200,
    marginVertical: 12,
  },
  dateTimeSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.gray100,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginTop: 4,
    gap: 10,
  },
  dateTimeIcon: {
    backgroundColor: COLORS.green50,
    padding: 8,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  date: {
    fontSize: 12,
    color: TEXTS.secondary,
    fontWeight: "500",
    marginBottom: 2,
  },
  time: {
    fontSize: 13,
    color: TEXTS.primary,
    fontWeight: "600",
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 6,
  },
});
