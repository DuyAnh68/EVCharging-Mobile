import { LoginReq, RegisterReq } from "@src/types/auth";
import { UserForm } from "@src/types/user";
import { VehicleForm } from "@src/types/vehicle";

// REGISTER
export type RegisterForm = RegisterReq & {
  confirmPassword: string;
};

export const validateRegister = (
  field: keyof RegisterForm,
  value: string,
  formData: RegisterForm
): string | undefined => {
  switch (field) {
    case "username":
      if (!value.trim()) return "Vui lòng nhập tên người dùng.";
      if (value.length < 3) return "Tên người dùng phải có ít nhất 3 ký tự.";
      break;
    case "email":
      if (!value.trim()) return "Vui lòng nhập email.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        return "Email không hợp lệ.";
      break;
    case "phone":
      if (!value.trim()) return "Vui lòng nhập số điện thoại.";
      const phone = value.replace(/\s+/g, "");

      if (phone.length < 9 || phone.length > 11)
        return "Số điện thoại có độ dài từ 9 - 11 ký tự.";

      // Kiểm tra định dạng Việt Nam: bắt đầu bằng 0 hoặc +84
      if (
        !/^(0|\+84)(3[2-9]|5[2689]|7[06789]|8[1-9]|9[0-9])[0-9]{7}$/.test(phone)
      )
        return "Số điện thoại không hợp lệ. Vui lòng nhập đúng định dạng.";
      break;
    case "password":
      if (!value.trim()) return "Vui lòng nhập mật khẩu.";
      if (value.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự.";
      break;
    case "confirmPassword":
      if (!value.trim()) return "Vui lòng nhập lại mật khẩu.";
      if (value !== formData.password) return "Mật khẩu xác nhận không khớp.";
      break;
  }
  return undefined;
};

// LOGIN
export type LoginErrors = Partial<Record<keyof LoginReq, string>>;

export const validateLogin = (data: LoginReq): LoginErrors => {
  const errors: LoginErrors = {};

  // Email
  if (!data.email?.trim()) {
    errors.email = "Vui lòng nhập email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Email không hợp lệ.";
  }

  // Password
  if (!data.password?.trim()) {
    errors.password = "Vui lòng nhập mật khẩu.";
  }

  return errors;
};

// VEHICLE
const validateVietnamPlate = (plateRaw: string): boolean => {
  if (!plateRaw || typeof plateRaw !== "string") return false;

  const raw = plateRaw.trim().toUpperCase();
  const normalized = raw
    .replace(/\s+/g, "")
    .replace(/[-\s]/g, "-")
    .replace(/\./g, ".");

  const patterns: RegExp[] = [
    /^\d{2}[A-Z]{1}-\d{3}\.\d{2}$/, // 30A-123.45
    /^\d{2}[A-Z]{1}-\d{4}$/, // 30A-1234
    /^\d{2}[A-Z]{2}-\d{3}\.\d{2}$/, // 12AB-123.45
    /^\d{2}[A-Z]{2}-\d{4}$/, // 12AB-1234
  ];

  return patterns.some((re) => re.test(normalized));
};

export const validateVehicle = (
  field: keyof VehicleForm,
  value: string | number | null | undefined
): string | undefined => {
  const strValue = value?.toString() ?? "";

  switch (field) {
    case "model":
      if (!strValue.trim()) return "Vui lòng nhập hãng xe.";
      if (strValue.length < 2) return "Tên hãng xe phải có ít nhất 2 ký tự.";
      break;

    case "plateNumber":
      if (!strValue.trim()) return "Vui lòng nhập biển số xe.";
      if (!validateVietnamPlate(strValue))
        return "Biển số xe không hợp lệ (VD: 30A-123.45 hoặc 29A-1234).";
      break;

    case "batteryCapacity":
      if (!strValue.trim()) return "Vui lòng nhập dung lượng pin.";
      const capacity = Number(strValue);
      if (isNaN(capacity)) return "Dung lượng pin phải là số.";
      if (!Number.isInteger(capacity))
        return "Dung lượng pin phải là số nguyên.";
      if (capacity <= 0) return "Dung lượng pin phải lớn hơn 0.";
      break;
  }

  return undefined;
};

// USER
export const validateUser = (
  field: keyof UserForm,
  value: string
): string | undefined => {
  switch (field) {
    case "username":
      if (!value.trim()) return "Vui lòng nhập tên người dùng.";
      if (value.length < 3) return "Tên người dùng phải có ít nhất 3 ký tự.";
      break;
    case "email":
      if (!value.trim()) return "Vui lòng nhập email.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        return "Email không hợp lệ.";
      break;
    case "phone":
      if (!value.trim()) return "Vui lòng nhập số điện thoại.";
      const phone = value.replace(/\s+/g, "");

      if (phone.length < 9 || phone.length > 11)
        return "Số điện thoại có độ dài từ 9 - 11 ký tự.";

      // Kiểm tra định dạng Việt Nam: bắt đầu bằng 0 hoặc +84
      if (
        !/^(0|\+84)(3[2-9]|5[2689]|7[06789]|8[1-9]|9[0-9])[0-9]{7}$/.test(phone)
      )
        return "Số điện thoại không hợp lệ. Vui lòng nhập đúng định dạng.";
      break;
  }
  return undefined;
};
