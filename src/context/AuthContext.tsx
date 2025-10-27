import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLoading } from "@src/context/LoadingContext";
import { useAuth } from "@src/hooks/useAuth";
import { User } from "@src/types/user";
import { tokenEvents } from "@src/utils/tokenEvents";
import { router } from "expo-router";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useErrorModal } from "./ErrorModalContext";

type AuthContextType = {
  accessToken: string | null;
  refreshToken: string | null;
  exp: number | null;
  user: User | null;
  isInitializing: boolean;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // State
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [exp, setExp] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  // Hook
  const { showLoading, hideLoading, resetLoading } = useLoading();
  const { refresh, decodeToken, getInfo } = useAuth();
  const { showError } = useErrorModal();

  // Ref
  const refreshTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasInitialized = useRef(false);

  // Auto refresh
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

  // Check auth
  const initAuth = async () => {
    resetLoading();
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    setIsInitializing(true);
    showLoading();

    try {
      const [storedAccess, storedRefresh] = await AsyncStorage.multiGet([
        "accessToken",
        "refreshToken",
      ]).then((res) => res.map(([, v]) => v));

      if (!storedAccess || !storedRefresh) {
        // accessToken, refreshToken đều null
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
        // accessToken còn hạn
        console.log("👌 Access token còn hạn, đăng nhập lại người dùng...");
        setAccessToken(storedAccess);
        setRefreshToken(storedRefresh);
        setExp(decoded.exp);
        scheduleAutoRefresh(decoded.exp, storedRefresh);

        const info = await getInfo();
        if (info.success && info.data) setUser(info.data);
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
          const info = await getInfo();
          if (info.success && info.data) setUser(info.data);
        } else {
          setIsInitializing(false);
          hideLoading();

          await logout();
          showError(res.message || "Phiên đăng nhập đã hết hạn!");
        }
      }
    } catch (err) {
      console.error("Lỗi initAuth:", err);
    } finally {
      hideLoading();
      setIsInitializing(false);
    }
  };

  // Logout
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
    router.replace("/(auth)/login");
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
      await logout();
      showError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
    };

    tokenEvents.on("tokenExpired", handleTokenExpired);

    return () => {
      tokenEvents.off("tokenExpired", handleTokenExpired);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        exp,
        user,
        setUser,
        logout,
        isInitializing,
      }}
    >
      {!isInitializing && children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used inside AuthProvider");
  return ctx;
};
