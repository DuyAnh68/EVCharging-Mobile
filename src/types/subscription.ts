export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  discount: number;
  billingCycle: string;
  limitType: string;
  description: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type SubPlanDetail = Omit<
  SubscriptionPlan,
  "discount" | "description" | "isActive" | "createdAt" | "updatedAt"
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
