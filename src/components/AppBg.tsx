import { COLORS } from "@src/styles/theme";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";

type BackgroundProps = {
  children: React.ReactNode;
};

export const Background: React.FC<BackgroundProps> = ({ children }) => {
  return (
    <LinearGradient
      colors={COLORS.gradient_4}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
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
    borderWidth: 1,
  },
});
