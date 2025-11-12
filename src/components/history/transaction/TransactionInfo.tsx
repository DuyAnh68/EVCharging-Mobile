import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import ScrollingText from "@src/components/animation/ScrollingText";
import { COLORS, TEXTS } from "@src/styles/theme";
import { StyleSheet, Text, View } from "react-native";

interface TransactionInfoProps {
  label: string;
  value: string;
  icon: string;
  iconType?: "Ionicons" | "FontAwesome" | "MaterialIcons";
  color: string;
}

export default function TransactionInfo({
  label,
  value,
  icon,
  iconType = "Ionicons",
  color,
}: TransactionInfoProps) {
  const renderIcon = () => {
    switch (iconType) {
      case "FontAwesome":
        return <FontAwesome name={icon as any} size={22} color={color} />;
      case "MaterialIcons":
        return <MaterialIcons name={icon as any} size={24} color={color} />;
      default:
        return <Ionicons name={icon as any} size={24} color={color} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.icon}>{renderIcon()}</View>
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
