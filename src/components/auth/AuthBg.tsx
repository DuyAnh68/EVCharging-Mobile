import { FloatingIcon } from "@src/components/animation/FloatingIcon";
import { COLORS } from "@src/styles/theme";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, View } from "react-native";

type BackgroundProps = {
  children: React.ReactNode;
};

export const Background: React.FC<BackgroundProps> = ({ children }) => {
  const icons = [
    { name: "sun", size: 80, x: 0.12, y: 0.08 },
    { name: "leaf", size: 60, x: 0.32, y: 0.18 },
    { name: "cloud", size: 70, x: 0.68, y: 0.1 },
    { name: "wind", size: 85, x: 0.85, y: 0.22 },
    { name: "drop", size: 50, x: 0.05, y: 0.25 },
    { name: "leaf", size: 75, x: 0.42, y: 0.35 },
    { name: "sun", size: 65, x: 0.78, y: 0.38 },
    { name: "cloud", size: 80, x: 0.58, y: 0.48 },
    { name: "wind", size: 90, x: 0.25, y: 0.45 },
    { name: "drop", size: 55, x: 0.9, y: 0.52 },
    { name: "leaf", size: 65, x: 0.15, y: 0.65 },
    { name: "sun", size: 70, x: 0.45, y: 0.68 },
    { name: "cloud", size: 60, x: 0.7, y: 0.6 },
    { name: "wind", size: 85, x: 0.88, y: 0.72 },
    { name: "drop", size: 50, x: 0.28, y: 0.78 },
    { name: "leaf", size: 55, x: 0.58, y: 0.85 },
    { name: "sun", size: 75, x: 0.12, y: 0.9 },
    { name: "cloud", size: 65, x: 0.4, y: 0.92 },
    { name: "wind", size: 90, x: 0.75, y: 0.95 },
    { name: "drop", size: 60, x: 0.92, y: 0.88 },
  ];

  return (
    <LinearGradient
      colors={COLORS.gradient_2}
      locations={[0, 0.25, 0.5, 0.75, 1]}
      style={styles.container}
    >
      {/* Decorative Circles */}
      <View style={styles.decorativeCircle1} />
      <View style={styles.decorativeCircle2} />
      <View style={styles.decorativeCircle3} />
      <View style={styles.decorativeCircle4} />
      <View style={styles.decorativeCircle5} />

      {/* Floating Icons */}
      {icons.map((icon, i) => (
        <FloatingIcon key={i} {...icon} />
      ))}

      {/* Main Content */}
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  decorativeCircle1: {
    position: "absolute",
    width: 500,
    height: 500,
    borderRadius: 250,
    backgroundColor: COLORS.circle1,
    top: -250,
    right: -150,
    opacity: 0.8,
  },
  decorativeCircle2: {
    position: "absolute",
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: COLORS.circle2,
    bottom: -150,
    left: -100,
    opacity: 0.6,
  },
  decorativeCircle3: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: COLORS.circle3,
    top: "40%",
    left: -80,
    opacity: 0.5,
  },
  decorativeCircle4: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: COLORS.circle4,
    top: "60%",
    right: -60,
    opacity: 0.6,
  },
  decorativeCircle5: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: COLORS.circle5,
    top: "10%",
    left: "50%",
    opacity: 0.4,
  },
});
