import { Background } from "@src/components/AppBg";
import { Stack } from "expo-router";

export default function HistoryLayout() {
  return (
    <Background>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "transparent" },
          animation: "fade",
        }}
      >
        <Stack.Screen name="charge" options={{ headerShown: false }} />
        <Stack.Screen name="invoice" options={{ headerShown: false }} />
      </Stack>
    </Background>
  );
}
