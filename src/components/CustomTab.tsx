import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "@src/styles/theme";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type TabName = "map" | "session" | "index" | "vehicle" | "profile";

interface CustomTabProps {
  activeTab: TabName;
  onTabPress: (tab: TabName) => void;
}

interface TabItem {
  name: TabName;
  label: string;
  iconSet: "Ionicons" | "MaterialCommunityIcons";
  active: string;
  inactive: string;
  size?: number;
}

const tabs: TabItem[] = [
  {
    name: "map",
    label: "Bản đồ",
    iconSet: "MaterialCommunityIcons",
    active: "map-marker-radius",
    inactive: "map-marker-radius-outline",
  },
  {
    name: "session",
    label: "Phiên sạc",
    iconSet: "Ionicons",
    active: "flash",
    inactive: "flash-outline",
  },
  {
    name: "index",
    label: "Đặt chỗ",
    iconSet: "Ionicons",
    active: "document-text",
    inactive: "document-text-outline",
    size: 35,
  },
  {
    name: "vehicle",
    label: "Q.Lý xe",
    iconSet: "Ionicons",
    active: "car-sport",
    inactive: "car-sport-outline",
    size: 26,
  },
  {
    name: "profile",
    label: "Tài khoản",
    iconSet: "Ionicons",
    active: "person",
    inactive: "person-outline",
  },
];

export const CustomTab: React.FC<CustomTabProps> = ({
  activeTab,
  onTabPress,
}) => {
  const renderIcon = (
    iconSet: string,
    icon: string,
    color: string,
    size = 24
  ) => {
    switch (iconSet) {
      case "Ionicons":
        return <Ionicons name={icon as any} size={size} color={color} />;
      case "MaterialCommunityIcons":
        return (
          <MaterialCommunityIcons
            name={icon as any}
            size={size}
            color={color}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.name;
        const iconName = isActive ? tab.active : tab.inactive;
        const isMain = tab.name === "index";
        const iconColor = isMain
          ? isActive
            ? COLORS.white
            : COLORS.black
          : isActive
          ? COLORS.white
          : COLORS.gray600;

        return (
          <TouchableOpacity
            key={tab.name}
            style={[styles.tabButton, isMain && styles.mainTabButton]}
            onPress={() => onTabPress(tab.name)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.iconContainer,
                isActive && styles.iconContainerActive,
                isMain && styles.mainIconContainer,
                isMain && isActive && styles.mainIconContainerActive,
              ]}
            >
              {renderIcon(tab.iconSet, iconName, iconColor, tab.size)}
            </View>
            <Text
              style={[styles.label, isActive && styles.labelActive]}
              numberOfLines={1}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    paddingBottom: 20,
    paddingTop: 10,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.green100,
    minHeight: 70,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  mainTabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    marginBottom: 4,
  },
  iconContainerActive: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  mainIconContainer: {
    position: "absolute",
    top: -80,
    width: 70,
    height: 70,
    borderRadius: 100,
    backgroundColor: COLORS.green200,
  },
  mainIconContainerActive: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  label: {
    fontSize: 11,
    fontWeight: "500",
    color: COLORS.gray600,
    textAlign: "center",
  },
  labelActive: {
    color: COLORS.primary,
    fontWeight: "600",
  },
});
