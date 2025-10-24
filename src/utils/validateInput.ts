import { LoginReq, RegisterReq } from "@src/types/auth";

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
      if (!/^[0-9]{9,11}$/.test(value))
        return "Số điện thoại có độ dài từ 9 - 11 ký tự.";
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
