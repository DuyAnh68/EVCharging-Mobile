import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Xin chào!</Text>
        <Text style={styles.subtitle}>Tìm trạm sạc gần bạn</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="flash" size={24} color="#FFD700" />
          <Text style={styles.cardTitle}>Trạm sạc gần nhất</Text>
        </View>
        <Text style={styles.cardContent}>Trạm sạc EV Station - 500m</Text>
        <Text style={styles.cardSubtext}>2/4 cổng sạc có sẵn</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="time" size={24} color="#007AFF" />
          <Text style={styles.cardTitle}>Lịch sử sạc</Text>
        </View>
        <Text style={styles.cardContent}>Lần sạc gần nhất: Hôm qua</Text>
        <Text style={styles.cardSubtext}>Thời gian: 45 phút</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="card" size={24} color="#34C759" />
          <Text style={styles.cardTitle}>Số dư tài khoản</Text>
        </View>
        <Text style={styles.cardContent}>250,000 VNĐ</Text>
        <Text style={styles.cardSubtext}>Cập nhật lần cuối: Hôm nay</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#8E8E93",
  },
  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 15,
    marginVertical: 5,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    marginLeft: 10,
  },
  cardContent: {
    fontSize: 16,
    color: "#000000",
    marginBottom: 5,
  },
  cardSubtext: {
    fontSize: 14,
    color: "#8E8E93",
  },
});
