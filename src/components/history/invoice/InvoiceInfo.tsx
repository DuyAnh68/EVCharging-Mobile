import { Ionicons } from "@expo/vector-icons";
import ScrollingText from "@src/components/animation/ScrollingText";
import { COLORS, TEXTS } from "@src/styles/theme";
import { StyleSheet, Text, View } from "react-native";

interface InvoiceInfoProps {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

export default function InvoiceInfo({
  label,
  value,
  icon,
  color,
}: InvoiceInfoProps) {
  return (
    <View style={styles.container}>
      <View style={styles.icon}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={styles.content}>
        <Text style={styles.label}>{label}</Text>
        {value.length > 13 ? (
          <ScrollingText text={value} threshold={13} style={styles.value} />
        ) : (
          <Text style={[styles.value]}>{value}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: "48%",
    maxHeight: 60,
    backgroundColor: COLORS.green50,
    borderRadius: 12,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  icon: {},
  content: {
    flex: 1,
  },
  label: {
    fontSize: 11,
    color: TEXTS.secondary,
    fontWeight: "500",
    marginBottom: 2,
  },
  value: {
    fontSize: 13,
    fontWeight: "700",
    color: TEXTS.primary,
  },
});
