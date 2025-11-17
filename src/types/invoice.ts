export type PaymentStatus = "paid" | "unpaid";

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

export interface Invoice {
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
    originalChargingFee: number;
    subscriptionDiscount?: {
      id: string;
      discountPercentage: string;
      discountAmount: string;
    };
    chargingFee: number;
    overtime: {
      hasOvertime: boolean;
      bookingEndTime: string | null;
      overtimeMinutes: number;
      overtimeFeeRate: number;
      overtimeFee: number;
    };
    totalAmount: number;
  };
  payment: {
    finalAmount: number;
    paymentStatus: PaymentStatus;
    paymentMethod: string;
    paymentDate: string | null;
    transactdatId: string | null;
  };
}

export type PayForChargingReq = {
  userId: string;
  invoiceIds: string[];
  amount: number;
};

export type InvoiceTransaction = {
  id: string;
  plateNumber: string;
  station: string;
  startTime: string;
  endTime: string;
  energyDelivered: number;
  totalAmount: number;
};
