import { useLoading } from "@src/context/LoadingContext";
import { bookingService } from "@src/services/bookingService";
import { BookingReq } from "@src/types/booking";
import { mapErrorMsg } from "@src/utils/errorMsgMapper";

export const useBooking = () => {
  const { showLoading, hideLoading } = useLoading();

  const createBooking = async (payload: BookingReq) => {
    try {
      showLoading();
      const res = await bookingService.create(payload);
      const isSuccess = res.status === 200 || res.status === 201;
      return {
        success: isSuccess,
        data: res.data,
        message: res.data?.message || "Tạo booking thành công",
      };
    } catch (error: any) {
      const message = error.response?.data?.message || error.customMessage;
      const status = error?.response?.status;
      const viMessage = mapErrorMsg(message, status);
      return {
        success: false,
        message: viMessage || "Không thể tạo booking",
      };
    } finally {
      hideLoading();
    }
  };

  const getAllBookingsFilterChargingPoints = async (
    chargingPointId: string
  ) => {
    showLoading();
    try {
      const res = await bookingService.getAllFilterChargingPoints(
        chargingPointId
      );
      const isSuccess = res.status === 200 || res.status === 201;
      return {
        success: isSuccess,
        data: res.data,
        message: res.data?.message || "",
      };
    } catch (error: any) {
      return {
        success: false,
        message: "Không thể lấy danh sách booking!",
      };
    } finally {
      hideLoading();
    }
  };

  // GET BOOKING BY ID
  const getBookingById = async (id: string) => {
    showLoading();
    try {
      const res = await bookingService.getById(id);
      const isSuccess = res.status === 200 || res.status === 201;
      return {
        success: isSuccess,
        data: res.data,
        message: res.data?.message || "",
      };
    } catch (error: any) {
      return {
        success: false,
        message: "Không thể lấy thông tin booking!",
      };
    } finally {
      hideLoading();
    }
  };

  const getAllMyBooking = async (userId: string) => {
    console.log(userId);
    showLoading();
    try {
      const res = await bookingService.getAllMyBooking(userId);
      console.log(res);
      const isSuccess = res.status === 200 || res.status === 201;
      return {
        success: isSuccess,
        data: res.data,
        message: res.data?.message || "",
      };
    } catch (error: any) {
      return {
        success: false,
        message: "Không thể lấy thông tin booking!",
      };
    } finally {
      hideLoading();
    }
  };

  // UPDATE BOOKING
  const updateBooking = async (id: string, payload: Partial<BookingReq>) => {
    try {
      showLoading();
      const res = await bookingService.update(id, payload);
      const isSuccess = res.status === 200 || res.status === 201;
      return {
        success: isSuccess,
        data: res.data,
        message: res.data?.message || "Cập nhật booking thành công",
      };
    } catch (error: any) {
      const message = error.response?.data?.message || error.customMessage;
      const status = error?.response?.status;
      const viMessage = mapErrorMsg(message, status);
      return {
        success: false,
        message: viMessage || "Không thể cập nhật booking",
      };
    } finally {
      hideLoading();
    }
  };

  // DELETE BOOKING
  const deleteBooking = async (id: string) => {
    try {
      showLoading();
      const res = await bookingService.delete(id);
      const isSuccess = res.status === 200 || res.status === 201;
      return {
        success: isSuccess,
        data: res.data,
        message: res.data?.message || "Xóa booking thành công",
      };
    } catch (error: any) {
      const message = error.response?.data?.message || error.customMessage;
      const status = error?.response?.status;
      const viMessage = mapErrorMsg(message, status);
      return {
        success: false,
        message: viMessage || "Không thể xóa booking",
      };
    } finally {
      hideLoading();
    }
  };

  const payForBaseFee = async (
    amount: number,
    userId: string,
    bookingId: string
  ) => {
    console.log("amount", amount);

    try {
      showLoading();
      const data = await bookingService.payForBaseFee(
        amount.amount,
        amount.userId,
        amount.bookingId
      );
      return {
        success: true,
        data,
        message: "Thanh toán phí đặt chỗ thành công!",
      };
    } catch (error: any) {
      const message = error.response?.data?.message || error.customMessage;
      const status = error?.response?.status;
      const viMessage = mapErrorMsg(message, status);
      return {
        success: false,
        message: viMessage || "Thanh toán thất bại!",
      };
    } finally {
      hideLoading();
    }
  };

  return {
    createBooking,
    getAllBookingsFilterChargingPoints,
    getBookingById,
    updateBooking,
    deleteBooking,
    getAllMyBooking,
    payForBaseFee,
  };
};
