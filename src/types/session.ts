import { ChargingPoint } from "@src/types/point";
import { Station } from "@src/types/station";
import { Vehicle } from "@src/types/vehicle";

export interface SessionDetail {
  id: string;
  bookingId: string;
  chargingPoint: ChargingPoint;
  vehicle: Vehicle;
  station?: Station;
  startTime: string;
  endTime: string;
  status: string;
  initialBattery: number;
  targetBattery: number;
  currentBattery: number;
  energyDeliveredKwh: number;
  chargingMinutes: number;
  chargingHours: number;
  baseFee: number;
  price: number;
  chargingFee: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}
