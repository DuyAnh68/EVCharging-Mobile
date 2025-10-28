import { useLoading } from "@src/context/LoadingContext";
import { useSubscription } from "@src/hooks/useSubscription";
import { subscriptionService } from "@src/services/subscriptionService";
import { vehicleService } from "@src/services/vehicleService";
import { SubVehicleReq } from "@src/types/subscription";
import { CreateVehicleResponse } from "@src/types/vehicle";
import { mapErrorMsg } from "@src/utils/errorMsgMapper";
import { toVehiclePayload } from "@src/utils/mapData";
import { useState } from "react";

export const useVehicle = () => {
  // Hook
  const { showLoading, hideLoading } = useLoading();
  const { create: createSub, update: updateSub } = useSubscription();

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
  const create = async (payload: any): Promise<CreateVehicleResponse> => {
    setIsLoading(true);

    try {
      // 1. Tạo xe
      const vehiclePayload = toVehiclePayload(payload);
      const resVehicle = await vehicleService.create(vehiclePayload);

      if (resVehicle.status !== 200 && resVehicle.status !== 201) {
        throw { step: "createVehicle", error: new Error("Tạo xe thất bại.") };
      }

      const createdVehicle = resVehicle.data;

      // 2. Nếu có gói đăng ký thì tiếp tục
      if (payload.subscriptionId) {
        try {
          const subPayload: SubVehicleReq = {
            vehicle_id: createdVehicle._id,
            subscription_id: payload.subscriptionId,
            auto_renew: payload.autoRenew ?? false,
            payment_status: "pending",
          };

          const resSub = await subscriptionService.create(subPayload);

          if (resSub.status !== 200 && resSub.status !== 201) {
            throw {
              step: "createSubscription",
              error: new Error("Đăng ký gói thất bại."),
            };
          }

          return {
            success: true,
            vehicle: createdVehicle,
            subscription: resSub.data,
          };
        } catch (error: any) {
          // Nếu lỗi từ API đăng ký gói
          throw { step: "createSubscription", error, vehicle: createdVehicle };
        }
      }

      // 3. Nếu không có gói
      return {
        success: true,
        vehicle: createdVehicle,
      };
    } catch (err: any) {
      const step = err.step ?? "unknown";

      return {
        success: false,
        step,
        message:
          step === "createVehicle"
            ? "Không thể tạo xe."
            : step === "createSubscription"
            ? "Không thể đăng ký gói cho xe."
            : "Đã xảy ra lỗi không xác định.",
        ...(err.vehicle ? { vehicle: err.vehicle } : {}),
      };
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

      console.log("vehiclePayload", vehiclePayload);

      const resVehicle = await vehicleService.update(
        payload.vehicleId,
        vehiclePayload
      );

      if (![200, 201].includes(resVehicle.status)) {
        throw { step: "updateVehicle", message: "Cập nhật xe thất bại!" };
      }

      const updatedVehicle = resVehicle.data;

      // 2. Cập nhật gói đăng ký
      if (payload.isUpdateSub) {
        if (payload.preSubId === null || payload.preSubId === undefined) {
          // 2.1 Nếu trước đó chưa có gói
          const subPayload: SubVehicleReq = {
            vehicle_id: payload.vehicleId,
            subscription_id: payload.subId,
            auto_renew: payload.autoRenew ?? false,
            payment_status: "pending",
          };

          const resSub = await createSub(subPayload);

          if (!resSub.success) {
            throw {
              step: "createSub",
              message: resSub.message || "Đăng ký gói thất bại!",
            };
          }

          return {
            success: true,
            vehicle: updatedVehicle,
            subscription: resSub.data,
          };
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
      return {
        success: false,
        message: "Xóa xe thất bại!",
      };
    } finally {
      hideLoading();
    }
  };

  return { getVehicles, create, update, deleteVehicle, isLoading };
};
