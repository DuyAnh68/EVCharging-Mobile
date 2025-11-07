import { Background } from "@src/components/AppBg";
import { Stack } from "expo-router";

export default function VNPayLayout() {
  return (
    <Background>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "transparent" },
          animation: "fade",
        }}
      >
        <Stack.Screen name="subscription" options={{ headerShown: false }} />
      </Stack>
    </Background>
  );
}
