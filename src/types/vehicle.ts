export interface Vehicle {
  user_id: {
    _id: string;
    username: string;
    email: string;
    status: "active" | "inactive" | string;
    role: "driver" | "admin" | "manager" | string;
  };
  company_id: string | null;
  plate_number: string;
  model: string;
  batteryCapacity: number;
  subscription_id: string | null;
  createdAt: string;
  updatedAt: string;
}
