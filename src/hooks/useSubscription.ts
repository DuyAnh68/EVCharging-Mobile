import { useLoading } from "@src/context/LoadingContext";
import { subscriptionService } from "@src/services/subscriptionService";
import {
  PayForSubReq,
  SubVehicleReq,
  UpdateSubReq,
} from "@src/types/subscription";
import { mapErrorMsg } from "@src/utils/errorMsgMapper";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";

export const useSubscription = () => {
  const { showLoading, hideLoading } = useLoading();

  // GET LIST
  const getSubPlans = async () => {
    try {
      showLoading();
      const res = await subscriptionService.getSubPlans();

      const isSuccess = res.status === 200 || res.status === 201;
      return {
        success: isSuccess,
        subscriptions: res.data,
      };
    } catch (error: any) {
      const message = error.response?.data?.message || error.customMessage;
      const status = error?.response?.status;
      const viMessage = mapErrorMsg(message, status);
      return {
        success: false,
        message: viMessage || "Không thể lấy danh sách gói đăng ký!",
      };
    } finally {
      hideLoading();
    }
  };

  // CREATE
  const create = async (payload: SubVehicleReq) => {
    try {
      const res = await subscriptionService.create(payload);
      const isSuccess = res.status === 200 || res.status === 201;
      return { success: isSuccess, data: res.data };
    } catch (error: any) {
      return { success: false, message: "Đăng ký gói thất bại!" };
    }
  };

  // UPDATE
  const getUpdateType = (
    preSubId?: string,
    subId?: string
  ): UpdateSubReq["type"] => {
    if (preSubId && subId) return "change subscription";
    if (preSubId && !subId) return "no renew";
    return "renew";
  };

  const update = async (preSubId: string, subId: string) => {
    try {
      const type = getUpdateType(preSubId, subId);

      const payload: UpdateSubReq = {
        type,
        subscription_plan_id: subId ?? null,
      };

      const res = await subscriptionService.update(preSubId, payload);

      const isSuccess = res.status === 200 || res.status === 201;
      return {
        success: isSuccess,
        data: res.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: "Cập nhật gói đăng ký thất bại!",
      };
    }
  };

  // PAYMENT
  const payForSubscription = async (payload: PayForSubReq) => {
    try {
      const res = await subscriptionService.payForSubscription(payload);

      const isSuccess = res.status === 200 || res.status === 201;
      return {
        success: isSuccess,
        data: res.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: "Chuyển trang thanh toán thất bại!",
      };
    }
  };

  const handleVNPayPayment = async (paymentUrl: string) => {
    const redirectUrl = Linking.createURL("vnpay/subscription");

    const result = await WebBrowser.openAuthSessionAsync(
      paymentUrl,
      redirectUrl
    );

    if (result.type === "success") {
      // URL trả về sau khi thanh toán
      const { url } = result;
      console.log("VNPay callback URL:", url);

      const data = Linking.parse(url);
      const { status, vehicleSubscriptionId } = data.queryParams || {};

      if (status === "success") {
        console.log("Thanh toán thành công:", vehicleSubscriptionId);
      } else {
        console.log("Thanh toán thất bại");
      }
    } else {
      console.log("Người dùng đóng cửa sổ thanh toán");
    }
  };

  return { getSubPlans, create, update, payForSubscription, handleVNPayPayment };
};
