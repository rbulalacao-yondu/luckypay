import type { User } from './User';
import type { GamingMachine } from './GamingMachine';

export interface CoinIn {
  id: string;
  userId: number;
  machineId: string;
  gameType: string;
  amount: number;
  machineBalance: number;
  timestamp: string;
  user?: User;
  machine?: GamingMachine;
}
