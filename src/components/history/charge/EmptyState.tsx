import { Ionicons } from "@expo/vector-icons";
import { COLORS, TEXTS } from "@src/styles/theme";
import { StyleSheet, Text, View } from "react-native";

interface EmptyStateProps {
  filter: "all" | "completed" | "ongoing";
}

export default function EmptyState({ filter }: EmptyStateProps) {
  const getEmptyMessage = (filter: string) => {
    switch (filter) {
      case "completed":
        return "Chưa có phiên sạc hoàn thành!";
      case "ongoing":
        return "Không có phiên sạc đang diễn ra!";
      default:
        return "Chưa có lịch sử sạc!";
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.emoji}>
        <Ionicons name="flash" size={60} color={COLORS.gray400} />
      </View>
      <Text style={styles.message}>{getEmptyMessage(filter)}</Text>
      <Text style={styles.subtitle}>Hãy bắt đầu sạc điện xe của bạn để xem được lịch sử sạc.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 60,
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
