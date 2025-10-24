import { Background } from "@src/components/auth/Background";
import { COLORS, TEXTS } from "@src/styles/theme";
import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";

export default function AuthLayout() {
  return (
    <Background>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <LinearGradient
            colors={COLORS.gradient_3}
            style={styles.logoGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Image
              source={require("../../assets/images/logo_evc.png")}
              resizeMode="contain"
              style={{ width: 80, height: 50 }}
            />
          </LinearGradient>
          <View style={styles.logoGlow} />
        </View>
        <Text style={styles.title}>EVCHARGE</Text>
      </View>

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "transparent" },
          animation: "fade",
        }}
        initialRouteName="login"
      >
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="forgot" options={{ headerShown: false }} />
      </Stack>

      <View style={styles.footer}>
        <View style={styles.footerDot} />
        <Text style={styles.footerText}>Phiên bản 1.0.0</Text>
        <View style={styles.footerDot} />
        <Text style={styles.footerText}>© 2025 EVCharge</Text>
        <View style={styles.footerDot} />
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  header: {
    justifyContent: "center",
    paddingHorizontal: 24,
    maxWidth: 480,
    width: "100%",
    alignItems: "center",
    marginTop: 100,
  },
  logoContainer: {
    position: "relative",
    marginBottom: 24,
  },
  logoGradient: {
    width: 96,
    height: 96,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  logoGlow: {
    position: "absolute",
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    opacity: 0.2,
    transform: [{ scale: 1.2 }],
    zIndex: -1,
  },
  title: {
    fontSize: 38,
    fontWeight: "800",
    color: TEXTS.white,
    letterSpacing: 2,
    textShadowColor: COLORS.primaryLight,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  footerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.white,
  },
  footerText: {
    color: TEXTS.white,
    fontSize: 12,
    fontWeight: "600",
  },
});
