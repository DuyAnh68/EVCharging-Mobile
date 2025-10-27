import { VehicleDetail } from "@src/types/vehicle";

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
          billingCycle:
            data.vehicle_subscription_id.subscription_id.billing_cycle,
          limitType: data.vehicle_subscription_id.subscription_id.limit_type,
        },
      }
    : null,
});

export const toVehicleListDetail = (data: any): VehicleDetail[] => {
  const list = Array.isArray(data) ? data : data?.vehicles;
  return (list || []).map(toVehicleDetail);
};
