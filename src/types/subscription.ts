export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  billingCycle: string;
  limitType: string;
}

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
  plan: SubscriptionPlan;
}
