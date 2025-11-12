import { Ionicons } from "@expo/vector-icons";
import { COLORS, TEXTS } from "@src/styles/theme";
import { StyleSheet, Text, View } from "react-native";

interface EmptyStateProps {
  filter: string | undefined;
}

export default function EmptyState({ filter }: EmptyStateProps) {
  const getEmptyMessage = (filter: EmptyStateProps["filter"]) => {
    switch (filter) {
      case "subscription":
        return "Không có giao dịch thanh toán gói!";
      case "base_fee":
        return "Không có giao dịch thanh toán phí đặt chỗ!";
      case "charging":
        return "Không có giao dịch thanh toán phí sạc!";
      case undefined:
      default:
        return "Chưa có giao dịch nào được ghi nhận!";
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.emoji}>
        <Ionicons name="card" size={60} color={COLORS.gray400} />
      </View>
      <Text style={styles.message}>{getEmptyMessage(filter)}</Text>
      <Text style={styles.subtitle}>
        Hãy bắt đầu sạc điện xe của bạn để tạo các giao dịch.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 100,
  },
  emoji: {
    marginBottom: 16,
  },
  message: {
    fontSize: 18,
    fontWeight: "700",
    color: TEXTS.primary,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: TEXTS.secondary,
    textAlign: "center",
    fontWeight: "400",
  },
});
