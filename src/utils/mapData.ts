import { SubscriptionPlan, SubVehicleReq } from "@src/types/subscription";
import { VehicleDetail, VehicleReq } from "@src/types/vehicle";

// VEHICLE
export const toVehicleDetail = (data: any): VehicleDetail => ({
  id: data._id,
  plateNumber: data.plate_number,
  model: data.model,
  batteryCapacity: data.batteryCapacity,
  subscriptionId: data.vehicle_subscription_id?._id ?? null,
  userId: data.user_id?._id ?? "",
  companyId: data.company_id?._id ?? null,
  company: data.company_id
    ? {
        id: data.company_id._id,
        name: data.company_id.name,
        address: data.company_id.address,
        email: data.company_id.contact_email,
      }
    : null,
  subscription: data.vehicle_subscription_id
    ? {
        id: data.vehicle_subscription_id._id,
        startDate: data.vehicle_subscription_id.start_date,
        endDate: data.vehicle_subscription_id.end_date,
        status: data.vehicle_subscription_id.status,
        autoRenew: data.vehicle_subscription_id.auto_renew,
        paymentStatus: data.vehicle_subscription_id.payment_status,
        createdAt: data.vehicle_subscription_id.createdAt,
        updatedAt: data.vehicle_subscription_id.updatedAt,
        plan: {
          id: data.vehicle_subscription_id.subscription_id._id,
          name: data.vehicle_subscription_id.subscription_id.name,
          price: data.vehicle_subscription_id.subscription_id.price,
          discount: data.vehicle_subscription_id.subscription_id.discount,
          billingCycle:
            data.vehicle_subscription_id.subscription_id.billing_cycle,
          description: data.vehicle_subscription_id.subscription_id.description,
          isCompany: data.vehicle_subscription_id.subscription_id.isCompany,
        },
      }
    : null,
});

export const toVehicleListDetail = (data: any): VehicleDetail[] => {
  const list = Array.isArray(data) ? data : data?.vehicles;
  return (list || []).map(toVehicleDetail);
};

export const toVehiclePayload = (data: any): VehicleReq => ({
  user_id: data.userId,
  model: data.model,
  plate_number: data.plateNumber,
  batteryCapacity: Number(String(data.batteryCapacity).replace(",", ".")),
});

// SUBSCRIPTION PLAN
export const toSubPlanDetail = (data: any): SubscriptionPlan => ({
  id: data._id,
  name: data.name,
  price: data.price,
  discount: data.discount,
  billingCycle: data.billing_cycle,
  description: data.description,
  isActive: data.is_active,
  isCompany: data.isCompany,
  createdAt: data.createdAt,
  updatedAt: data.updatedAt,
});

export const toSubPlanListDetail = (data: any): SubscriptionPlan[] => {
  const list = Array.isArray(data) ? data : data?.subcriptions;
  return (list || []).map(toSubPlanDetail);
};
