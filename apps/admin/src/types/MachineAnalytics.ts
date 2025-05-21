export interface MachineMetrics {
  id: string;
  location: string;
  type: string;
  manufacturer: string;
  model: string;
  coinInVolume: number;
  utilizationRate: number;
  currentBalance: number;
  popularity: number;
  gameTypes: Record<string, number>;
}

export interface LocationAnalytics {
  totalVolume: number;
  machineCount: number;
  avgUtilization: number;
  machines: string[];
}

export interface GameTypePopularity {
  type: string;
  count: number;
}

export interface MachineAnalytics {
  topMachines: MachineMetrics[];
  machineMetrics: MachineMetrics[];
  locationAnalytics: Record<string, LocationAnalytics>;
  gameTypePopularity: GameTypePopularity[];
}
