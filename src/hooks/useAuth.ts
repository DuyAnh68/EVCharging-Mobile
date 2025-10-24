// hooks/useAuth.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLoading } from "@src/context/LoadingContext";
import { authService } from "@src/services/authService";
import { DecodedToken, LoginReq, RegisterReq } from "@src/types/auth";
import { mapErrorMsg } from "@src/utils/errorMsgMapper";
import { jwtDecode } from "jwt-decode";

export const useAuth = () => {
  const { showLoading, hideLoading } = useLoading();

  // Decode
  const decodeToken = (token: string): DecodedToken | null => {
    try {
      return jwtDecode<DecodedToken>(token);
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  // REGISTER
  const register = async (payload: RegisterReq) => {
    try {
      showLoading();
      const res = await authService.register(payload);
      const isSuccess = res.status === 200 || res.status === 201;
      return {
        success: isSuccess,
        message: res.data?.message || "",
      };
    } catch (error: any) {
      const message = error.response?.data?.message || error.customMessage;
      const status = error?.response?.status;
      const viMessage = mapErrorMsg(message, status);
      return { success: false, message: viMessage || "Đăng ký thất bại" };
    } finally {
      hideLoading();
    }
  };

  // LOGIN
  const login = async (payload: LoginReq) => {
    try {
      showLoading();
      const res = await authService.login(payload);
      const isSuccess = res.status === 200 || res.status === 201;

      if (isSuccess) {
        const data = res.data;
        await AsyncStorage.multiSet([
          ["accessToken", data.accessToken],
          ["refreshToken", data.refreshToken],
        ]);

        const decoded = decodeToken(data.accessToken);
        if (decoded) {
          await AsyncStorage.multiSet([
            ["tokenExp", decoded.exp.toString()],
            ["user", JSON.stringify(decoded)],
          ]);
        }

      }
      return {
        success: isSuccess,
        message: res.data?.message || "",
      };
    } catch (error: any) {
      const message = error.response?.data?.message || error.customMessage;
      const status = error?.response?.status;
      const viMessage = mapErrorMsg(message, status);
      return { success: false, message: viMessage || "Đăng nhập thất bại" };
    } finally {
      hideLoading();
    }
  };

  // REFRESH
  const refresh = async (payload: string) => {
    try {
      const res = await authService.refresh(payload);
      console.log("payload refresh: ", payload);
      const isSuccess = res.status === 200 || res.status === 201;
      if (isSuccess) {
        const data = res.data;
        await AsyncStorage.multiSet([
          ["accessToken", data.accessToken],
          ["refreshToken", data.refreshToken],
        ]);

        const decoded = decodeToken(data.accessToken);
        if (decoded) {
          await AsyncStorage.multiSet([
            ["tokenExp", decoded.exp.toString()],
            ["user", JSON.stringify(decoded)],
          ]);
        }
      }

      return {
        success: isSuccess,
        data: res.data,
        message: res.data?.message || "",
      };
    } catch (error: any) {
      const message = error.response?.data?.message || error.customMessage;
      const status = error?.response?.status;
      const viMessage = mapErrorMsg(message, status);
      return {
        success: false,
        message: viMessage || "Phiên đăng nhập đã hết hạn!",
      };
    }
  };

  return { register, login, refresh, decodeToken };
};
