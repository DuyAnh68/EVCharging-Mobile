import { COLORS, TEXTS } from "@src/styles/theme";
import { StyleSheet, Text, View } from "react-native";

interface BatteryProgressProps {
  initialBattery: number;
  targetBattery: number;
  currentBattery: number;
}

export default function BatteryProgress({
  initialBattery,
  targetBattery,
  currentBattery,
}: BatteryProgressProps) {
  const progressPercentage =
    (currentBattery - initialBattery) / (targetBattery - initialBattery);
  const clampedProgress = Math.max(0, Math.min(1, progressPercentage));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Tiến độ sạc</Text>
        <Text style={styles.percentage}>{currentBattery}%</Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${clampedProgress * 100}%`,
              },
            ]}
          />
        </View>
      </View>

      <View style={styles.batteryRange}>
        <View style={styles.batteryPoint}>
          <Text style={styles.batteryLabel}>Bắt đầu</Text>
          <Text style={styles.batteryValue}>{initialBattery}%</Text>
        </View>
        <View style={styles.batteryPoint}>
          <Text style={styles.batteryLabel}>Mục tiêu</Text>
          <Text style={styles.batteryValue}>{targetBattery}%</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: TEXTS.secondary,
  },
  percentage: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
  },
  progressContainer: {
    marginBottom: 10,
  },
  progressBackground: {
    height: 8,
    backgroundColor: COLORS.green100,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  batteryRange: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  batteryPoint: {
    alignItems: "center",
  },
  batteryLabel: {
    fontSize: 11,
    color: TEXTS.secondary,
    fontWeight: "500",
    marginBottom: 2,
  },
  batteryValue: {
    fontSize: 12,
    fontWeight: "700",
    color: TEXTS.primary,
  },
});
