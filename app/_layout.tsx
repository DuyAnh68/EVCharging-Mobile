import { Background } from "@src/components/auth/AuthBg";
import { AuthProvider } from "@src/context/AuthContext";
import { LoadingProvider } from "@src/context/LoadingContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Background>
      <LoadingProvider>
        <AuthProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "fade",
            }}
          ></Stack>
        </AuthProvider>
      </LoadingProvider>
    </Background>
  );
}
