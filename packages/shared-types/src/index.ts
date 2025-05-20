// Common interfaces used across the application

export interface User {
  id: string;
  mobileNumber: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  USER = 'user',
  SUPER_ADMIN = 'super_admin',
  FINANCE_ADMIN = 'finance_admin',
  LOYALTY_MANAGER = 'loyalty_manager'
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  walletId: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  createdAt: Date;
}

export enum TransactionType {
  TOPUP = 'topup',
  WITHDRAWAL = 'withdrawal',
  MACHINE_CREDIT = 'machine_credit',
  MACHINE_DEBIT = 'machine_debit'
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export interface MachineSession {
  id: string;
  userId: string;
  machineId: string;
  startTime: Date;
  endTime?: Date;
  status: SessionStatus;
}

export enum SessionStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  TERMINATED = 'terminated'
}

export interface LoyaltyPoints {
  id: string;
  userId: string;
  points: number;
  tier: LoyaltyTier;
  updatedAt: Date;
}

export enum LoyaltyTier {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum'
}
