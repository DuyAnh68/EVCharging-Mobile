import { Background } from "@src/components/AppBg";
import { CustomTab, TabName } from "@src/components/CustomTab";
import { router, Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Background>
      <Tabs
        screenOptions={{
          headerShown: false,
          sceneStyle: { backgroundColor: "transparent" },
        }}
        tabBar={({ state }) => {
          const activeRoute = state.routes[state.index];
          return (
            <CustomTab
              activeTab={activeRoute.name as TabName}
              onTabPress={(tab) => {
                if (tab === "index") router.replace("/(tabs)");
                else router.replace(`/(tabs)/${tab}`);
              }}
            />
          );
        }}
      >
        <Tabs.Screen name="index" options={{ title: "Đặt chỗ" }} />
        <Tabs.Screen name="map" options={{ title: "Bản đồ" }} />
        <Tabs.Screen name="session" options={{ title: "Phiên sạc" }} />
        <Tabs.Screen name="vehicle" options={{ title: "Danh sách xe" }} />
        <Tabs.Screen name="profile" options={{ title: "Tài khoản" }} />
      </Tabs>
    </Background>
  );
}
