type ErrorMappingKey =
  | "duplicate"
  | "validation"
  | "unauthorized"
  | "forbidden"
  | "notfound"
  | "server"
  | "account"
  | "password"
  | "username"
  | "email"
  | "phone"
  | "invalid email or password"
  | "refresh token"
  | "default";

const errorMessageMap: Record<ErrorMappingKey, string> = {
  duplicate: "Tài khoản đã tồn tại.",
  validation: "Dữ liệu không hợp lệ.",
  unauthorized: "Bạn chưa đăng nhập hoặc phiên đã hết hạn.",
  forbidden: "Bạn không có quyền thực hiện thao tác này.",
  notfound: "Không tìm thấy dữ liệu.",
  server: "Lỗi hệ thống, vui lòng thử lại sau.",
  account: "Tài khoản không hợp lệ hoặc đã bị khóa.",
  password: "Mật khẩu không hợp lệ.",
  username: "Tên tài khoản đã tồn tại.",
  email: "Email đã được đăng ký.",
  phone: "Số điện thoại đã được đăng ký.",
  "invalid email or password": "Email hoặc mật khẩu không đúng.",
  "refresh token": "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!",
  default: "Đã xảy ra lỗi, vui lòng thử lại.",
};

export const mapErrorMsg = (message?: string, statusCode?: number): string => {
  // Nếu có message từ BE thì lọc theo nội dung
  if (message) {
    const lowerMsg = message.toLowerCase();

    if (lowerMsg.includes("invalid email or password"))
      return errorMessageMap["invalid email or password"];
    if (lowerMsg.includes("duplicate")) return errorMessageMap.duplicate;
    if (lowerMsg.includes("validation")) return errorMessageMap.validation;
    if (lowerMsg.includes("account")) return errorMessageMap.account;
    if (lowerMsg.includes("password")) return errorMessageMap.password;
    if (lowerMsg.includes("internal")) return errorMessageMap.server;
    if (lowerMsg.includes("email")) return errorMessageMap.email;
    if (lowerMsg.includes("phone")) return errorMessageMap.phone;
    if (lowerMsg.includes("username")) return errorMessageMap.username;
    if (lowerMsg.includes("refresh token"))
      return errorMessageMap["refresh token"];
  } else {
    // Nếu status code là các lỗi phổ biến
    if (statusCode === 400) return errorMessageMap.validation;
    if (statusCode === 401) return errorMessageMap.unauthorized;
    if (statusCode === 403) return errorMessageMap.forbidden;
    if (statusCode === 404) return errorMessageMap.notfound;
    if (statusCode === 500) return errorMessageMap.server;
  }

  // fallback
  return errorMessageMap.default;
};
