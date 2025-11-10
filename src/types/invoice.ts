export type PaymentStatus = "paid" | "unpaid";

export interface Invoice {
  id: string;
  station: string;
  address: string;
  vehicle: {
    model: string;
    plateNumber: string;
  };
  duration: string;
  energyDelivered: string;
  batteryCharged: string;
  totalAmount: string;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  createdAt: string;
}

export interface SummaryItem {
  count: number;
  totalAmount: string;
  totalEnergy: string;
}

export interface Summary {
  totalInvoices: number;
  unpaid: SummaryItem;
  paid: SummaryItem;
}

export interface InvoiceResponse {
  invoices: Invoice[];
  summary: Summary;
}

export interface InvoiceDetail {
  invoice: {
    id: string;
    createdAt: string;
  };
  station: {
    name: string;
    address: string;
  };
  vehicle: {
    model: string;
    plateNumber: string;
    batteryCapacity: string;
    isActive: boolean;
  };
  session: {
    startTime: string;
    endTime: string;
    duration: string;
    initialBattery: string;
    targetBattery: string;
    finalBattery: string;
    batteryCharged: string;
    targetReached: boolean;
    energyDelivered: string;
    powerCapacity: string;
    calculationMethod: string;
  };
  pricing: {
    baseFee: number;
    price: number;
    charging_fee: number;
    total_amount: number;
  };
  payment: {
    method: string;
    status: PaymentStatus;
  };
}

export type PayForChargingReq = {
  userId: string;
  invoiceIds: string[];
  amount: number;
};
