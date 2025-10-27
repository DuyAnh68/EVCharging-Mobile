import { COLORS } from "@src/styles/theme";
import { ActivityIndicator, Platform, StyleSheet, View } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const LoadingContent = () => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        Platform.OS === "ios" && { paddingTop: insets.top },
      ]}
    >
      <ActivityIndicator
        size="large"
        color={COLORS.primaryLighter}
        style={{ alignSelf: "center" }}
      />
    </View>
  );
};

const LoadingOverlay = () => {
  let hasSafeArea = true;

  // Move hook call outside of try-catch
  try {
    useSafeAreaInsets();
  } catch {
    hasSafeArea = false;
  }

  // Android doesn't need SafeAreaProvider
  if (Platform.OS === "android") {
    return <LoadingContent />;
  }

  // For iOS: wrap with SafeAreaProvider only if needed
  if (!hasSafeArea) {
    return (
      <SafeAreaProvider>
        <LoadingContent />
      </SafeAreaProvider>
    );
  }

  return <LoadingContent />;
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
});

export default LoadingOverlay;
