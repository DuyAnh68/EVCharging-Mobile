import { PortalProvider } from "@gorhom/portal";
import { Background } from "@src/components/auth/AuthBg";
import { AuthProvider } from "@src/context/AuthContext";
import { LoadingProvider } from "@src/context/LoadingContext";
import { PaymentProvider } from "@src/context/PaymentContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Background>
      <PortalProvider>
        <LoadingProvider>
          <AuthProvider>
            <PaymentProvider>
              {/* <DeepLinkHandler /> */}
              <Stack
                screenOptions={{
                  headerShown: false,
                  animation: "fade",
                }}
              ></Stack>
            </PaymentProvider>
          </AuthProvider>
        </LoadingProvider>
      </PortalProvider>
    </Background>
  );
}
