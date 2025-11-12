import { Entypo, Ionicons } from "@expo/vector-icons";
import TransactionInfo from "@src/components/history/transaction/TransactionInfo";
import { COLORS, TEXTS } from "@src/styles/theme";
import { Transaction } from "@src/types/transaction";
import { formatDateTime, formatRoundedAmount } from "@src/utils/formatData";
import {
  getTransactionStatusColor,
  getTransactionStatusLabel,
  getTransactionType,
} from "@src/utils/getHelper";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

interface CardProps {
  transaction: Transaction;
  onPress?: () => void;
}

export default function Card({ transaction, onPress }: CardProps) {
  // State
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");

  // UseEffect
  useEffect(() => {
    const { date: dateFormatted, time: timeFormatted } = formatDateTime(
      transaction.vnpPayDate
    );

    setDate(dateFormatted);
    setTime(timeFormatted);
  }, [transaction]);

  // Get
  const statusColor = getTransactionStatusColor(
    transaction.vnpTransactionStatus
  );
  const statusLabel = getTransactionStatusLabel(
    transaction.vnpTransactionStatus
  );
  const type = getTransactionType(transaction.type);

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={[styles.header]}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconContainer, { backgroundColor: type.color }]}>
            <Ionicons name={type.icon} size={24} color={COLORS.white} />
          </View>
          <View>
            <Text style={styles.title}>{type.name}</Text>
            <Text style={styles.transactionNo}>
              {transaction.vnpTransactionNo}
            </Text>
          </View>
        </View>

        {/* Status */}
        <View
          style={[styles.statusBadge, { backgroundColor: statusColor + "20" }]}
        >
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={[styles.statusText, { color: statusColor }]}>
            {statusLabel}
          </Text>
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

      {/* Transaction Info Grid */}
      <View style={styles.infoGrid}>
        <TransactionInfo
          label="Ngân hàng"
          value={transaction.vnpBankCode}
          icon="bank"
          iconType="FontAwesome"
          color={COLORS.info}
        />
        <TransactionInfo
          label="Loại thẻ"
          value={transaction.vnpCardType}
          icon="card"
          color={COLORS.warning}
        />

        <View style={[styles.totalContainer]}>
          <Text style={styles.totalLabel}>Tổng tiền</Text>
          <Text style={styles.totalValue}>
            {formatRoundedAmount(transaction.vnpAmount, {
              asString: true,
            })}
          </Text>
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
  title: {
    fontSize: 19,
    fontWeight: "700",
    color: TEXTS.primary,
    marginBottom: 2,
  },
  transactionNo: {
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
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.green200,
    marginVertical: 12,
  },
  totalContainer: {
    flex: 1,
    minWidth: "48%",
    height: 55,
    backgroundColor: COLORS.green50,
    borderRadius: 12,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    gap: 8,
  },
  totalLabel: {
    fontSize: 13,
    color: TEXTS.secondary,
    fontWeight: "600",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
  },
});
