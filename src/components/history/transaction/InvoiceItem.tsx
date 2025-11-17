import { Entypo, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import ScrollingText from "@src/components/animation/ScrollingText";
import { COLORS, TEXTS } from "@src/styles/theme";
import { InvoiceTransaction } from "@src/types/invoice";
import { calcChargingDuration } from "@src/utils/calculateData";
import { formatDateTime, formatRoundedAmount } from "@src/utils/formatData";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const InvoiceItem = ({ item }: { item: InvoiceTransaction }) => {
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [startFull, setStartFull] = useState("");
  const [endFull, setEndFull] = useState("");

  useEffect(() => {
    const {
      date: d1,
      time: t1,
      timeWithSeconds: full1,
    } = formatDateTime(item.startTime);

    const { time: t2, timeWithSeconds: full2 } = formatDateTime(item.endTime);

    setStartDate(d1);
    setStartTime(t1);
    setEndTime(t2);
    setStartFull(full1);
    setEndFull(full2);
  }, [item]);

  const timeDisplay = calcChargingDuration(startFull, endFull);

  return (
    <View style={styles.cardContainer}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconContainer]}>
            <Ionicons name="car-sport" size={24} color={COLORS.white} />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.plateNumber} numberOfLines={1}>
              {item.plateNumber}
            </Text>
            <Text style={styles.invoiceId}>{item.id}</Text>
          </View>
        </View>
        <View style={styles.amountBadge}>
          <Text style={styles.amountValue}>
            {formatRoundedAmount(item.totalAmount, { asString: true })}
          </Text>
        </View>
      </View>

      <View style={styles.detailsGrid}>
        {/* Date Info */}
        <View style={styles.detailItem}>
          <View style={styles.detailIconBox}>
            <Entypo name="calendar" size={18} color={COLORS.primary} />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Ngày</Text>
            <Text style={styles.detailValue}>{startDate}</Text>
          </View>
        </View>

        {/* Time Range Info */}
        <View style={styles.detailItem}>
          <View style={styles.detailIconBox}>
            <Ionicons name="time" size={18} color={COLORS.primary} />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Giờ</Text>
            <Text style={styles.detailValue} numberOfLines={1}>
              {startTime} - {endTime}
            </Text>
          </View>
        </View>

        {/* Station Info */}
        <View style={styles.detailItem}>
          <View style={styles.detailIconBox}>
            <Ionicons name="location" size={18} color={COLORS.primary} />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Trạm sạc</Text>
            {item.station.length > 13 ? (
              <ScrollingText
                text={item.station}
                threshold={13}
                style={styles.detailValue}
              />
            ) : (
              <Text style={[styles.detailValue]}>{item.station}</Text>
            )}
          </View>
        </View>

        {/* Time Duration Info */}
        <View style={styles.detailItem}>
          <View style={styles.detailIconBox}>
            <MaterialCommunityIcons
              name="timer"
              size={20}
              color={COLORS.primary}
            />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Thời lượng</Text>
            <Text style={styles.detailValue}>{timeDisplay}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 12,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.green300,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
    padding: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.green200,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
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
  headerInfo: {
    flex: 1,
  },
  plateNumber: {
    fontSize: 16,
    fontWeight: "700",
    color: TEXTS.primary,
    marginBottom: 2,
  },
  invoiceId: {
    fontSize: 12,
    color: TEXTS.secondary,
    fontWeight: "500",
  },
  amountBadge: {
    backgroundColor: COLORS.green50,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  amountValue: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  detailItem: {
    flex: 1,
    minWidth: "45%",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: COLORS.gray100,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray300,
  },
  detailIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.green50,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  detailContent: {
    flex: 1,
    maxHeight: 35,
  },
  detailLabel: {
    fontSize: 11,
    color: TEXTS.secondary,
    fontWeight: "500",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: "600",
    color: TEXTS.primary,
  },
});

export default InvoiceItem;
