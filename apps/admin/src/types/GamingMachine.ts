import { MachineStatus } from './MachineStatus';

export interface GamingMachine {
  id: string;
  location: string;
  type: string;
  manufacturer: string;
  model: string;
  denominations: string[];
  gameTypes: string[];
  payTables: string[];
  playerLimits: {
    minBet: number;
    maxBet: number;
  };
  firmwareVersion: string;
  gameVersion: string;
  status: MachineStatus;
}
