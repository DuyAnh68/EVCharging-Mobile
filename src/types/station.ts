export interface Station {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  connector_type: "AC" | "DC";
  power_capacity: number;
  price_per_kwh: number;
  base_fee: number;
  status: "online" | "offline";
}
