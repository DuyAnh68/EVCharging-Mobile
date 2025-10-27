export interface BookingReq {
  user_id: string;
  station_id: string;
  vehicle_id: string;
  chargingPoint_id: string;
  start_time: string;
  end_time: string;
}
