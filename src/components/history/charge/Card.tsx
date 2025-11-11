import { Entypo, Ionicons } from "@expo/vector-icons";
import SessionInfo from "@src/components/history/charge/SessionInfo";
import { COLORS, TEXTS } from "@src/styles/theme";
import { SessionDetail } from "@src/types/session";
import { calcChargingDuration } from "@src/utils/calculateData";
import {
  formatDateTime,
  formatRoundedAmount,
  formatVND,
} from "@src/utils/formatData";
import {
  getChargeStatusColor,
  getChargeStatusLabel,
} from "@src/utils/getHelper";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

interface CardProps {
  session: SessionDetail;
  onPress?: () => void;
}

export default function Card({ session, onPress }: CardProps) {
  // State
  const [date, setDate] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [startTimeWithSeconds, setStartTimeWithSeconds] = useState<string>("");
  const [endTimeWithSeconds, setEndTimeWithSeconds] = useState<string>("");

  // UseEffect
  useEffect(() => {
    const {
      date: dateFormatted,
      time: startTimeFormatted,
      timeWithSeconds: startTimeFull,
    } = formatDateTime(session.startTime);

    const { time: endTimeFormatted, timeWithSeconds: endTimeFull } =
      formatDateTime(session.endTime);

    setDate(dateFormatted);
    setStartTime(startTimeFormatted);
    setEndTime(endTimeFormatted);
    setStartTimeWithSeconds(startTimeFull);
    setEndTimeWithSeconds(endTimeFull);
  }, [session]);

  // Get
  const statusColor = getChargeStatusColor(session.status);
  const statusLabel = getChargeStatusLabel(session.status);

  // Tính duration
  const timeDisplay = calcChargingDuration(
    startTimeWithSeconds,
    endTimeWithSeconds
  );

  // Check
  const isActive = session.vehicle.isActive;

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={[styles.header, !isActive && { alignItems: "center" }]}>
        <View style={styles.headerLeft}>
          <View style={styles.iconContainer}>
            <Ionicons name="car-sport" size={24} color={COLORS.white} />
          </View>
          <View>
            <Text style={styles.plateNumber}>
              {session.vehicle.plateNumber}
            </Text>
            <Text style={styles.sessionModel}>{session.vehicle.model}</Text>
          </View>
        </View>

        {/* Status */}
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusColor + "20" },
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
          <Text style={styles.time}>
            {startTime} - {endTime}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Session Info Grid */}
      <View style={styles.infoGrid}>
        <SessionInfo
          label="Pin"
          value={`${session.currentBattery}%`}
          icon="battery-charging-sharp"
          color={COLORS.success}
        />
        <SessionInfo
          label="Thời lượng sạc"
          value={timeDisplay}
          icon="time"
          color={COLORS.black}
        />
        <SessionInfo
          label="Trạm sạc"
          value={session.station?.name || "N/A"}
          icon="location"
          color={COLORS.info}
        />
        <SessionInfo
          label="Tổng tiền"
          value={formatRoundedAmount(session.totalAmount, { asString: true })}
          icon="card"
          color={COLORS.warning}
        />
      </View>

      <View style={styles.divider} />

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.feeRow}>
          <Text style={styles.feeLabel}>Lượng điện đã xài</Text>
          <Text style={styles.feeValue}>{`${session.energyDeliveredKwh.toFixed(
            1
          )} kWh`}</Text>
        </View>
        <View style={styles.feeRow}>
          <Text style={styles.feeLabel}>Giá/kWh</Text>
          <Text style={styles.feeValue}>{formatVND(session.price)}</Text>
        </View>
        <View style={styles.feeRow}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Text style={styles.feeLabel}>Phí sạc</Text>
            <Text style={{ fontSize: 8, color: TEXTS.secondary }}>
              (Lượng điện x Giá)
            </Text>
          </View>
          <Text style={styles.feeValue}>{formatVND(session.chargingFee)}</Text>
        </View>
        <View style={styles.feeRow}>
          <Text style={styles.feeLabel}>Phí đặt chỗ</Text>
          <Text style={styles.feeValue}>{formatVND(session.baseFee)}</Text>
        </View>
      </View>
    </View>
  );
}

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
  header: {
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
    fontSize: 19,
    fontWeight: "700",
    color: TEXTS.primary,
    marginBottom: 2,
  },
  sessionModel: {
    fontSize: 14,
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
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
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
  divider: {
    height: 1,
    backgroundColor: COLORS.green200,
    marginVertical: 12,
  },
  footer: {
    gap: 6,
  },
  feeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  feeLabel: {
    fontSize: 11,
    color: TEXTS.secondary,
    fontWeight: "500",
  },
  feeValue: {
    fontSize: 11,
    fontWeight: "600",
    color: TEXTS.primary,
  },
});
