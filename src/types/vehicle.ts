import { Company } from "@src/types/company";
import { SubscriptionDetail } from "@src/types/subscription";

export interface Vehicle {
  id: string;
  plateNumber: string;
  model: string;
  batteryCapacity: number;
  subscriptionId?: string | null;
  userId: string;
  companyId?: string | null;
}

export interface VehicleDetail extends Vehicle {
  company?: Company | null;
  subscription?: SubscriptionDetail | null;
}

export type VehicleReq = Omit<Vehicle, "id" | "subscriptionId">;

export type VehicleForm = {
  plateNumber: string;
  model: string;
  batteryCapacity: string;
  subscriptionId?: string | null;
};
