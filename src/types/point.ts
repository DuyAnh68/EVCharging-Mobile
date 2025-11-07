export interface ChargingPoint {
  id: string;
  stationId: string;
  status: string;
  type: string;
  currentSessionId: string | null;
  createdAt: string;
}
