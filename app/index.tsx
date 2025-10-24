import { useAuthContext } from "@src/context/AuthContext";
import { Redirect } from "expo-router";

export default function Index() {
  const { user, isInitializing } = useAuthContext();

  if (isInitializing) return null;
  if (user) return <Redirect href="/(tabs)" />;
  return <Redirect href="/(auth)/login" />;
}
