import { PortalProvider } from "@gorhom/portal";
import { Background } from "@src/components/auth/AuthBg";
import { AuthProvider } from "@src/context/AuthContext";
import { LoadingProvider } from "@src/context/LoadingContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Background>
      <PortalProvider>
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
      </PortalProvider>
    </Background>
  );
}
