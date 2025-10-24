// Register
export type RegisterReq = {
  username: string;
  email: string;
  phone: string;
  password: string;
  role?: "admin" | "driver";
};

// Login
export type LoginReq = {
  email: string;
  password: string;
};

// Token
export type DecodedToken = {
  exp: number;
  iat: number;
  [key: string]: any;
};
