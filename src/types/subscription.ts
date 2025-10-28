export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  discount: number;
  billingCycle: string;
  description: string;
  isActive: boolean;
  isCompany: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type SubPlanDetail = Omit<
  SubscriptionPlan,
  "isActive" | "createdAt" | "updatedAt"
>;

export interface SubscriptionVehicle {
  id: string;
  startDate: string;
  endDate: string;
  status: string;
  autoRenew: boolean;
  paymentStatus: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubscriptionDetail extends SubscriptionVehicle {
  plan: SubPlanDetail;
}

export type SubVehicleReq = {
  vehicle_id: string;
  subscription_id: string;
  auto_renew: boolean;
  payment_status: string;
};

export type UpdateSubReq = {
  type: "no renew" | "renew" | "change subscription";
  subscription_plan_id: string | null;
};
