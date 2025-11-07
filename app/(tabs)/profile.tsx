import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import ModalPopup from "@src/components/ModalPopup";
import Info from "@src/components/profile/Info";
import { useAuthContext } from "@src/context/AuthContext";
import { useInvoice } from "@src/hooks/useInvoice";
import { useSession } from "@src/hooks/useSession";
import { COLORS } from "@src/styles/theme";
import { calcTotalChargingDuration } from "@src/utils/calculateData";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileScreen() {
  // Context
  const { logout, user } = useAuthContext();

  // Hook
  const { getSessionsCompleted } = useSession();
  const { getInvoices } = useInvoice();

  // State
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [stats, setStats] = useState({
    count: 0,
    totalHours: "",
    totalAmount: "",
  });

  // Api
  const fetchStats = async () => {
    if (!user) return;
    const resSession = await getSessionsCompleted(user.userId);
    if (resSession.success && resSession.sessions) {
      const totalHours = calcTotalChargingDuration(resSession.sessions);

      setStats((prev) => ({
        ...prev,
        count: resSession.sessions.length,
        totalHours,
      }));
    } else {
      setErrorMsg(resSession.message || "Không thể lấy dữ liệu phiên sạc!");
      setShowError(true);
      return;
    }

    const resInvoices = await getInvoices(user.userId);
    if (resInvoices.success && resInvoices.invoices) {
      const totalAmount = resInvoices.invoices.summary.paid.totalAmount;

      setStats((prev) => ({
        ...prev,
        totalAmount,
      }));
    } else {
      setErrorMsg(resInvoices.message || "Không thể lấy danh sách giao dịch!");
      setShowError(true);
      return;
    }
  };

  // Hanlde logic
  const handleShowInfo = () => {
    setShowInfo(true);
  };

  const handleSuccess = (message: string) => {
    setSuccessMsg(message);
    setShowSuccess(true);
  };

  const handleError = (message: string) => {
    setErrorMsg(message);
    setShowError(true);
  };

  const handleCloseInfo = () => {
    setShowInfo(false);
  };

  const showHistoryCharge = () => {
    router.replace("/(history)/charge");
  };

  const showHistoryInvoice = () => {
    router.replace("/(history)/invoice");
  };

  const handleLogout = async () => {
    await logout();
  };

  // Use Effect
  useEffect(() => {
    fetchStats();
  }, []);

  // Mock
  const menuItems = [
    {
      id: 1,
      title: "Thông tin tài khoản",
      icon: "person-outline",
      color: COLORS.info,
      onPress: handleShowInfo,
    },
    {
      id: 2,
      title: "Lịch sử sạc",
      icon: "flash-outline",
      color: COLORS.success,
      onPress: showHistoryCharge,
    },
    {
      id: 3,
      title: "Lịch sử giao dịch",
      icon: "card-outline",
      color: COLORS.warningDark,
      onPress: showHistoryInvoice,
    },
    // {
    //   id: 4,
    //   title: "Lịch sử gói đăng ký",
    //   icon: "receipt-outline",
    //   color: COLORS.danger,
    //   onPress: handleShowInfo,
    // },
    // {
    //   id: 5,
    //   title: "Cài đặt",
    //   icon: "settings-outline",
    //   color: COLORS.inactiveDark,
    //   onPress: handleShowInfo,
    // },
    // {
    //   id: 6,
    //   title: "Trợ giúp & Hỗ trợ",
    //   icon: "help-circle-outline",
    //   color: "#5856D6",
    // },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={50} color={COLORS.black} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.username}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            <Text style={styles.userPhone}>{user?.phone}</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text
              style={styles.statNumber}
              numberOfLines={1}
              adjustsFontSizeToFit={true}
              minimumFontScale={0.5}
            >
              {stats.count}
            </Text>
            <Text style={styles.statLabel}>Lần sạc</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text
              style={styles.statNumber}
              numberOfLines={1}
              adjustsFontSizeToFit={true}
              minimumFontScale={0.5}
            >
              {stats.totalHours}
            </Text>
            <Text style={styles.statLabel}>Thời gian sạc</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text
              style={styles.statNumber}
              numberOfLines={1}
              adjustsFontSizeToFit={true}
              minimumFontScale={0.5}
            >
              {stats.totalAmount}
            </Text>
            <Text style={styles.statLabel}>Đã tiêu</Text>
          </View>
        </View>

        {/* Menu */}
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <View
                  style={[
                    styles.menuIcon,
                    { backgroundColor: `${item.color}20` },
                  ]}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={24}
                    color={item.color}
                  />
                </View>
                <Text style={styles.menuTitle}>{item.title}</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={COLORS.gray300}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.danger} />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Info Modal */}
      {showInfo && user && (
        <Info
          visible={showInfo}
          user={user}
          onClose={handleCloseInfo}
          onSuccess={(message) => {
            handleSuccess(message);
          }}
          onError={(message) => {
            handleError(message);
          }}
        />
      )}

      {/* Toast Modal */}
      {showSuccess && (
        <ModalPopup
          visible={showSuccess}
          mode="toast"
          contentText={successMsg}
          icon={<FontAwesome5 name="check" size={30} color="white" />}
          iconBgColor="green"
          onClose={() => {
            setShowSuccess(false);
          }}
          modalWidth={355}
        />
      )}

      {showError && (
        <ModalPopup
          visible={showError}
          mode="noti"
          contentText={errorMsg}
          icon={<FontAwesome5 name="exclamation" size={30} color="white" />}
          iconBgColor="red"
          confirmBtnText="Đóng"
          confirmBtnColor="grey"
          onClose={() => {
            setShowError(false);
            setErrorMsg("");
          }}
          modalWidth={355}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 60,
    paddingBottom: 20,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    marginLeft: 20,
    marginRight: 30,
    padding: 20,
    borderRadius: 100,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  userInfo: {},
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: "500",
    marginBottom: 3,
  },
  userPhone: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: "500",
  },
  contentContainer: {
    paddingTop: 15,
  },
  statsContainer: {
    backgroundColor: COLORS.white,
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 12,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-around",

    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
    minWidth: 0,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.secondary,
    marginBottom: 5,
    flexShrink: 1,
    minHeight: 24,
    lineHeight: 24,
  },
  statLabel: {
    fontSize: 14,
    color: "#8E8E93",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#E5E5EA",
    marginHorizontal: 10,
  },
  menuContainer: {
    backgroundColor: COLORS.white,
    marginHorizontal: 15,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  menuTitle: {
    fontSize: 16,
    color: "#000000",
    fontWeight: "500",
  },
  logoutButton: {
    backgroundColor: COLORS.white,
    marginHorizontal: 15,
    marginBottom: 40,
    borderRadius: 12,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoutText: {
    fontSize: 16,
    color: COLORS.danger,
    fontWeight: "600",
    marginLeft: 10,
  },
});
