import { useLoading } from "@src/context/LoadingContext";
import { useSubscription } from "@src/hooks/useSubscription";
import { vehicleService } from "@src/services/vehicleService";
import { PayForSubReq } from "@src/types/subscription";
import { PostVehicleResponse } from "@src/types/vehicle";
import { mapErrorMsg } from "@src/utils/errorMsgMapper";
import { toVehiclePayload } from "@src/utils/mapData";
import { useState } from "react";

export const useVehicle = () => {
  // Hook
  const { showLoading, hideLoading } = useLoading();
  const {
    create: createSub,
    update: updateSub,
    createPaymentUrl,
    navigateVNPay,
  } = useSubscription();

  // State
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // GET LIST
  const getVehicles = async () => {
    try {
      showLoading();
      const res = await vehicleService.getVehicles();

      const isSuccess = res.status === 200 || res.status === 201;
      return {
        success: isSuccess,
        vehicles: res.data,
      };
    } catch (error: any) {
      const message = error.response?.data?.message || error.customMessage;
      const status = error?.response?.status;
      const viMessage = mapErrorMsg(message, status);
      return {
        success: false,
        message: viMessage || "Không thể lấy danh sách xe!",
      };
    } finally {
      hideLoading();
    }
  };

  // CREATE
  const create = async (payload: any): Promise<PostVehicleResponse> => {
    setIsLoading(true);

    try {
      // 1. Tạo xe
      const vehiclePayload = toVehiclePayload(payload);
      let createdVehicle;

      try {
        const resVehicle = await vehicleService.create(vehiclePayload);

        if (![200, 201].includes(resVehicle.status)) {
          throw { step: "createVehicle", message: "Tạo xe thất bại!" };
        }

        createdVehicle = resVehicle.data;
      } catch (err: any) {
        throw {
          step: "createVehicle",
          message: "Tạo xe thất bại do biển số đã tồn tại.",
        };
      }

      // 2. Nếu có gói đăng ký thì tiếp tục
      if (payload.subscriptionId) {
        const subPayload: PayForSubReq = {
          userId: payload.userId,
          vehicle_id: createdVehicle._id,
          subscription_id: payload.subscriptionId,
          amount: payload.amount,
          payment_status: "pending",
        };

        const resSub = await createPaymentUrl(subPayload);

        if (!resSub.success) {
          return {
            success: false,
            message:
              "Tạo phiên thanh toán thất bại. Vui lòng mua lại gói đăng ký sau.",
            step: "createUrl",
          };
        }

        const paymentUrl = resSub.data;
        if (paymentUrl) {
          await navigateVNPay(paymentUrl, false);

          return {
            success: false,
            message: "Đang chờ thanh toán VNPay...",
            step: "pendingPayment",
          };
        }
      }

      // 3. Nếu không có gói
      return {
        success: true,
        vehicle: createdVehicle,
      };
    } catch (error: any) {
      switch (error.step) {
        case "createVehicle":
          return {
            success: false,
            message: error.message || "Không thể tạo xe!",
            step: "createVehicle",
          };
        case "createSubscription":
          return {
            success: false,
            message: error.message || "Không thể đăng ký gói cho xe!",
            step: "createSubscription",
          };
        default:
          return {
            success: false,
            message: "Đã xảy ra lỗi không xác định khi tạo xe!",
            step: "unknown",
          };
      }
    } finally {
      setIsLoading(false);
    }
  };

  // UPDATE
  const update = async (payload: any) => {
    try {
      setIsLoading(true);

      // 1. Cập nhật xe
      const vehiclePayload = toVehiclePayload({
        userId: payload.userId,
        model: payload.model,
        plateNumber: payload.plateNumber,
        batteryCapacity: payload.batteryCapacity,
      });

      let updatedVehicle;

      try {
        const resVehicle = await vehicleService.update(
          payload.vehicleId,
          vehiclePayload
        );

        if (![200, 201].includes(resVehicle.status)) {
          throw { step: "updateVehicle", message: "Cập nhật xe thất bại!" };
        }

        updatedVehicle = resVehicle.data;
      } catch (err: any) {
        throw {
          step: "updateVehicle",
          message: "Cập nhật xe thất bại do biển số đã tồn tại.",
        };
      }

      // 2. Cập nhật gói đăng ký
      if (payload.isUpdateSub) {
        if (payload.preSubId === null || payload.preSubId === undefined) {
          // 2.1 Nếu trước đó chưa có gói
          const subPayload: PayForSubReq = {
            userId: payload.userId,
            vehicle_id: payload.vehicleId,
            subscription_id: payload.subId,
            amount: payload.amount,
            payment_status: "pending",
          };

          const resSub = await createPaymentUrl(subPayload);

          if (!resSub.success) {
            return {
              success: false,
              message:
                "Tạo phiên thanh toán thất bại. Vui lòng mua lại gói đăng ký sau.",
              step: "createUrl",
            };
          }

          const paymentUrl = resSub.data;
          if (paymentUrl) {
            await navigateVNPay(paymentUrl, true);

            return {
              success: false,
              message: "Đang chờ thanh toán VNPay...",
              step: "pendingPayment",
            };
          }
        } else {
          // 2.2 Nếu trước đó có gói
          const resSub = await updateSub(payload.preSubId, payload.subId);

          if (!resSub.success) {
            throw {
              step: "updateSub",
              message: resSub.message || "Cập nhật gói đăng ký thất bại!",
            };
          }

          return {
            success: true,
            vehicle: updatedVehicle,
            subscription: resSub.data,
          };
        }
      }

      // 3. Chỉ cập nhật xe
      return {
        success: true,
        vehicle: updatedVehicle,
      };
    } catch (error: any) {
      // Xác định lỗi theo step
      switch (error.step) {
        case "updateVehicle":
          return {
            success: false,
            message: error.message,
            step: "updateVehicle",
          };
        case "createSub":
          return { success: false, message: error.message, step: "createSub" };
        case "updateSub":
          return { success: false, message: error.message, step: "updateSub" };
        default:
          return {
            success: false,
            message: "Cập nhật xe hoặc gói đăng ký thất bại!",
            step: "unknown",
          };
      }
    } finally {
      setIsLoading(false);
    }
  };

  // DELETE
  const deleteVehicle = async (vehicleId: string) => {
    try {
      showLoading();

      const res = await vehicleService.delete(vehicleId);

      const isSuccess = res.status === 200 || res.status === 201;
      return {
        success: isSuccess,
        data: res.data,
      };
    } catch (error: any) {
      const message = error.response?.data?.message || error.customMessage;
      const status = error?.response?.status;
      const viMessage = mapErrorMsg(message, status);
      return {
        success: false,
        message: viMessage || "Xóa xe thất bại!",
      };
    } finally {
      hideLoading();
    }
  };

  return { getVehicles, create, update, deleteVehicle, isLoading };
};
