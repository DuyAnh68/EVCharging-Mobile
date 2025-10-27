import { useLoading } from "@src/context/LoadingContext";
import { bookingService } from "@src/services/bookingService";
import { BookingReq } from "@src/types/booking";
import { mapErrorMsg } from "@src/utils/errorMsgMapper";

export const useBooking = () => {
  const { showLoading, hideLoading } = useLoading();

  // CREATE BOOKING
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

  // GET ALL BOOKINGS
  const getAllBookings = async () => {
    try {
      const res = await bookingService.getAll();
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
    }
  };

  // GET BOOKING BY ID
  const getBookingById = async (id: string) => {
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

  return {
    createBooking,
    getAllBookings,
    getBookingById,
    updateBooking,
    deleteBooking,
  };
};
