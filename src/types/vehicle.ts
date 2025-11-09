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
  isActive: boolean;
}

export interface VehicleDetail extends Vehicle {
  company?: Company | null;
  subscription?: SubscriptionDetail | null;
}

export type VehicleReq = {
  user_id: string;
  model: string;
  plate_number: string;
  batteryCapacity: number;
};

export type VehicleForm = {
  plateNumber: string;
  model: string;
  batteryCapacity: string;
  subscriptionId?: string | null;
};

type PostVehicleSuccess = {
  success: true;
  vehicle: any;
  subscription?: any;
};

type PostVehicleError = {
  success: false;
  step:
    | "createVehicle"
    | "updateVehicle"
    | "createSubscription"
    | "pendingPayment"
    | "createUrl"
    | "unknown";
  message: string;
  vehicle?: any;
};

export type PostVehicleResponse = PostVehicleSuccess | PostVehicleError;
