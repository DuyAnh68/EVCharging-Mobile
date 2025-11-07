export interface User {
  userId: string;
  username: string;
  email: string;
  phone: string;
  role: "admin" | "driver";
  status?: "active" | "inactive" | "banned";
  isCompany: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type UserForm = Omit<
  User,
  "userId" | "role" | "status" | "isCompany" | "createdAt" | "updatedAt"
>;
