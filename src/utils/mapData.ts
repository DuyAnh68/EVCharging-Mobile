import {
  Invoice,
  InvoiceDetail,
  InvoiceResponse,
  Summary,
} from "@src/types/invoice";
import { SessionDetail } from "@src/types/session";
import { SubscriptionPlan } from "@src/types/subscription";
import { Transaction } from "@src/types/transaction";
import { VehicleDetail, VehicleReq } from "@src/types/vehicle";

// VEHICLE
export const toVehicleDetail = (data: any): VehicleDetail => ({
  id: data._id,
  plateNumber: data.plate_number,
  model: data.model,
  batteryCapacity: data.batteryCapacity,
  subscriptionId: data.vehicle_subscription_id?._id ?? null,
  userId: data.user_id?._id ?? "",
  isActive: data.isActive,
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

// SESSION
export const toSessionDetail = (data: any): SessionDetail => ({
  id: data._id,
  bookingId: data.booking_id?._id || null,
  chargingPoint: {
    id: data.chargingPoint_id._id,
    stationId: data.chargingPoint_id.stationId,
    status: data.chargingPoint_id.status,
    type: data.chargingPoint_id.type,
    currentSessionId: data.chargingPoint_id.current_session_id,
    createdAt: data.chargingPoint_id.create_at,
  },
  vehicle: data.vehicle_id
    ? {
        id: data.vehicle_id._id,
        plateNumber: data.vehicle_id.plate_number,
        model: data.vehicle_id.model,
        batteryCapacity: data.vehicle_id.batteryCapacity,
        subscriptionId: data.vehicle_id.vehicle_subscription_id,
        userId: data.vehicle_id.user_id,
        companyId: data.vehicle_id.company_id,
        isActive: data.vehicle_id.isActive,
      }
    : {
        id: "",
        plateNumber: "",
        model: "",
        batteryCapacity: 0,
        subscriptionId: null,
        userId: null,
        companyId: null,
        isActive: false,
      },
  startTime: data.start_time,
  endTime: data.end_time,
  status: data.status,
  initialBattery: data.initial_battery_percentage,
  targetBattery: data.target_battery_percentage,
  currentBattery: data.current_battery_percentage,
  energyDeliveredKwh: data.energy_delivered_kwh,
  chargingMinutes: data.charging_duration_minutes,
  chargingHours: data.charging_duration_hours,
  baseFee: data.base_fee,
  price: data.price_per_kwh,
  chargingFee: data.charging_fee,
  totalAmount: data.total_amount,
  createdAt: data.createdAt,
  updatedAt: data.updatedAt,
});

export const toSessionListDetail = (data: any): SessionDetail[] => {
  const list = Array.isArray(data) ? data : data?.sessions;
  return (list || []).map(toSessionDetail);
};

// INVOICE
export const toInvoice = (data: any): Invoice => {
  // Tách model và biển số
  let model = "";
  let plateNumber = "";
  if (typeof data.vehicle === "string" && data.vehicle.includes(" - ")) {
    [model, plateNumber] = data.vehicle.split(" - ");
  } else {
    model = data.vehicle || "";
  }

  // Chuẩn hóa tiền
  let totalAmount = data.total_amount || "0đ";
  if (typeof totalAmount === "string") {
    totalAmount = totalAmount.replace(/\s*đ/, "đ").trim();
  }

  return {
    id: data.id,
    station: data.station,
    address: data.address,
    vehicle: {
      model,
      plateNumber,
      isActive: data.vehicle_is_active,
    },
    duration: data.duration,
    energyDelivered: data.energy_delivered,
    batteryCharged: data.battery_charged,
    totalAmount,
    paymentStatus: data.payment_status,
    paymentMethod: data.payment_method,
    createdAt: data.created_at,
  };
};

export const toSummary = (data: any): Summary => {
  const normalizeAmount = (amount: string | undefined): string => {
    if (!amount) return "0đ";
    return amount.replace(/\s*đ/, "đ").trim();
  };

  return {
    totalInvoices: data.total_invoices || 0,
    unpaid: {
      count: data.unpaid?.count || 0,
      totalAmount: normalizeAmount(data.unpaid?.total_amount),
      totalEnergy: data.unpaid?.total_energy || "0.00 kWh",
    },
    paid: {
      count: data.paid?.count || 0,
      totalAmount: normalizeAmount(data.paid?.total_amount),
      totalEnergy: data.paid?.total_energy || "0.00 kWh",
    },
  };
};

export const toInvoiceList = (data: any): InvoiceResponse => ({
  invoices: Array.isArray(data.invoices) ? data.invoices.map(toInvoice) : [],
  summary: data.summary
    ? toSummary(data.summary)
    : {
        totalInvoices: 0,
        unpaid: { count: 0, totalAmount: "0đ", totalEnergy: "0.00 kWh" },
        paid: { count: 0, totalAmount: "0đ", totalEnergy: "0.00 kWh" },
      },
});

export const toInvoiceDetail = (data: any): InvoiceDetail => ({
  invoice: {
    id: data.invoice_info.id,
    createdAt: data.invoice_info.created_at,
  },
  station: {
    name: data.station_info.name,
    address: data.station_info.address,
  },
  vehicle: {
    model: data.vehicle_info.model,
    plateNumber: data.vehicle_info.plate_number,
    batteryCapacity: data.vehicle_info.battery_capacity,
    isActive: data.vehicle_info.is_active,
  },
  session: {
    startTime: data.charging_session.start_time,
    endTime: data.charging_session.end_time,
    duration: data.charging_session.duration,
    initialBattery: data.charging_session.initial_battery,
    targetBattery: data.charging_session.target_battery,
    finalBattery: data.charging_session.final_battery,
    batteryCharged: data.charging_session.battery_charged,
    targetReached: data.charging_session.target_reached,
    energyDelivered: data.charging_session.energy_delivered,
    powerCapacity: data.charging_session.power_capacity,
    calculationMethod: data.charging_session.calculation_method,
  },
  pricing: {
    baseFee: data.pricing.base_fee,
    price: data.pricing.price_per_kwh,
    charging_fee: data.pricing.charging_fee,
    total_amount: data.pricing.total_amount,
  },
  payment: {
    method: data.payment.method,
    status: data.payment.status,
  },
});

// TRANSACTION
export const toTransaction = (data: any): Transaction => ({
  id: data._id,
  type: data.type,
  companyId: data.companyId || null,
  vnpTxnRef: data.vnp_TxtRef,
  vnpAmount: data.vnp_Amount,
  vnpTransactionNo: data.vnp_TransactionNo,
  vnpBankCode: data.vnp_BankCode,
  vnpCardType: data.vnp_CardType,
  vnpPayDate: data.vnp_PayDate,
  vnpResponseCode: data.vnp_ResponseCode,
  vnpTransactionStatus: data.vnp_TransactionStatus,
});

export const toTransactionList = (data: any): Transaction[] => {
  const list = Array.isArray(data) ? data : data?.payments;
  return (list || []).map(toTransaction);
};
