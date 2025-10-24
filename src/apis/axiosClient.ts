import AsyncStorage from "@react-native-async-storage/async-storage";
import { tokenEvents } from "@src/utils/tokenEvents";
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "https://your-api-domain.com/api";

const axiosClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 50000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await AsyncStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const status = error.response?.status;
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (status === 401 && originalRequest) {
      console.log("axiosClient bị 401!!!")
      tokenEvents.emit("tokenExpired");
    }

    // Tạo object lỗi thống nhất
    const message =
      (error.response?.data as any)?.message ||
      "Something went wrong. Please try again later.";

    // Gắn thêm message vào error để catch phía sau dùng được
    (error as any).customMessage = message;
    return Promise.reject(error);
  }
);

export default axiosClient;
