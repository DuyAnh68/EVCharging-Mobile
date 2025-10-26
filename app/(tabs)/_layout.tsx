import { Background } from "@src/components/AppBg";
import { CustomTab, TabName } from "@src/components/CustomTab";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Background>
      <Tabs
        screenOptions={{
          headerShown: false,
          sceneStyle: { backgroundColor: "transparent" },
          animation: "fade",
        }}
        tabBar={({ state, navigation }) => {
          const activeRoute = state.routes[state.index];
          return (
            <CustomTab
              activeTab={activeRoute.name as TabName}
              onTabPress={(tab) => {
                const route = state.routes.find((r) => r.name === tab);
                if (route) navigation.navigate(tab);
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
