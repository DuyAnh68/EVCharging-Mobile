import { FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ModalPopup from "@src/components/ModalPopup";
import { useLoading } from "@src/context/LoadingContext";
import { useAuth } from "@src/hooks/useAuth";
import { User } from "@src/types/user";
import { tokenEvents } from "@src/utils/tokenEvents";
import { createContext, useContext, useEffect, useRef, useState } from "react";

type AuthContextType = {
  accessToken: string | null;
  refreshToken: string | null;
  exp: number | null;
  user: User | null;
  isInitializing: boolean;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [exp, setExp] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [errorModal, setErrorModal] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { showLoading, hideLoading } = useLoading();
  const { refresh, decodeToken } = useAuth();

  const refreshTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasInitialized = useRef(false);

  const scheduleAutoRefresh = (exp: number, refreshToken: string) => {
    if (refreshTimeout.current) clearTimeout(refreshTimeout.current);
    const now = Math.floor(Date.now() / 1000);
    const refreshTime = Math.max((exp - now - 300) * 1000, 0); // 5 phút trước khi hết hạn
    if (refreshTime > 0) {
      refreshTimeout.current = setTimeout(async () => {
        console.log("🔄 Auto refreshing token...");
        const res = await refresh(refreshToken);
        if (res.success) {
          setAccessToken(res.data.accessToken);
          setRefreshToken(res.data.refreshToken);
          const decoded = decodeToken(res.data.accessToken);
          if (decoded?.exp) {
            setExp(decoded.exp);
            scheduleAutoRefresh(decoded.exp, res.data.refreshToken);
          }
        } else {
          await logout();
        }
      }, refreshTime);
    }
  };

  const initAuth = async () => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    setIsInitializing(true);
    showLoading();

    try {
      const [storedAccess, storedRefresh, storedUser] =
        await AsyncStorage.multiGet([
          "accessToken",
          "refreshToken",
          "user",
        ]).then((res) => res.map(([, v]) => v));

      if (!storedAccess || !storedRefresh) {
        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);
        hideLoading();
        setIsInitializing(false);
        return;
      }

      const decoded = decodeToken(storedAccess);
      const now = Math.floor(Date.now() / 1000);

      if (decoded?.exp && decoded.exp > now) {
        console.log("Access token còn hạn, đăng nhập lại người dùng...");
        setAccessToken(storedAccess);
        setRefreshToken(storedRefresh);
        setExp(decoded.exp);
        setUser(storedUser ? JSON.parse(storedUser) : decoded);
        scheduleAutoRefresh(decoded.exp, storedRefresh);
      } else {
        // accessToken hết hạn → thử refresh
        console.log("⚠️ Access token hết hạn, đang thử refresh...");
        const res = await refresh(storedRefresh);
        if (res.success) {
          setAccessToken(res.data.accessToken);
          setRefreshToken(res.data.refreshToken);
          const decodedNew = decodeToken(res.data.accessToken);
          if (decodedNew?.exp) {
            setExp(decodedNew.exp);
            scheduleAutoRefresh(decodedNew.exp, res.data.refreshToken);
          }
          if (decodedNew) {
            const userData: User = {
              userId: decodedNew.accountId,
              role: decodedNew.role,
            };
            await AsyncStorage.setItem("user", JSON.stringify(userData));
            setUser(userData);
          }
        } else {
          setErrorMsg(res.message || "Phiên đăng nhập đã hết hạn!");
          setErrorModal(true);

          setIsInitializing(false);
          hideLoading();

          setTimeout(async () => {
            await logout();
          }, 2500);
        }
      }
    } catch (err) {
      console.error("Lỗi initAuth:", err);
    } finally {
      hideLoading();
      setIsInitializing(false);
    }
  };

  const logout = async () => {
    if (refreshTimeout.current) clearTimeout(refreshTimeout.current);
    await AsyncStorage.multiRemove([
      "accessToken",
      "refreshToken",
      "tokenExp",
      "user",
    ]);
    setAccessToken(null);
    setRefreshToken(null);
    setExp(null);
    setUser(null);
    hasInitialized.current = false;
  };

  useEffect(() => {
    initAuth();
    return () => {
      if (refreshTimeout.current) clearTimeout(refreshTimeout.current);
    };
  }, []);

  useEffect(() => {
    // Lắng nghe sự kiện token hết hạn từ axiosClient
    const handleTokenExpired = async () => {
      setErrorMsg("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
      setErrorModal(true);
      setTimeout(async () => {
        await logout();
      }, 2500);
    };

    tokenEvents.on("tokenExpired", handleTokenExpired);

    return () => {
      tokenEvents.off("tokenExpired", handleTokenExpired);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ accessToken, refreshToken, exp, user, logout, isInitializing }}
    >
      {!isInitializing && children}

      {errorModal && (
        <ModalPopup
          visible={errorModal}
          mode="toast"
          contentText={errorMsg}
          icon={<FontAwesome5 name="exclamation" size={30} color="white" />}
          iconBgColor="yellow"
          onClose={() => {
            setErrorModal(false);
            setErrorMsg("");
          }}
          modalWidth={355}
        />
      )}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used inside AuthProvider");
  return ctx;
};
