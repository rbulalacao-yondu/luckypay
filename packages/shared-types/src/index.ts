// Common interfaces used across the application

// User related types
export interface User {
  id: string;
  mobileNumber: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  email?: string;
  firstName?: string;
  lastName?: string;
  status: UserStatus;
  isMobileVerified: boolean;
  isEmailVerified: boolean;
  walletBalance: number;
  loyaltyTier: LoyaltyTier;
  loyaltyPoints: number;
  lastLoginAt?: Date;
  lastLoginIp?: string;
  deviceId?: string;
  fcmTokens?: string[];
  avatar?: string;
  address?: string;
  dateOfBirth?: Date;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  notifications: boolean;
  marketingEmails: boolean;
  language: string;
  theme: string;
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING_VERIFICATION = 'pending_verification',
}

export enum UserRole {
  USER = 'user',
  SUPER_ADMIN = 'super_admin',
  FINANCE_ADMIN = 'finance_admin',
  LOYALTY_MANAGER = 'loyalty_manager',
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
  MACHINE_DEBIT = 'machine_debit',
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
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
  TERMINATED = 'terminated',
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
  PLATINUM = 'platinum',
}

// Authentication related types
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

export interface RequestOtpDto {
  mobileNumber: string;
}

export interface VerifyOtpDto {
  mobileNumber: string;
  otp: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

// Transaction related types
export interface TransactionDto {
  amount: number;
  type: TransactionType;
  description?: string;
  referenceId?: string;
}

export interface TransactionResponse extends Transaction {
  balance: number;
  description?: string;
  referenceId?: string;
  metadata?: Record<string, any>;
}

// Machine related types
export interface Machine {
  id: string;
  name: string;
  location: string;
  status: MachineStatus;
  type: MachineType;
  pricePerMinute: number;
  currentSession?: MachineSession;
  lastMaintenance?: Date;
  nextMaintenance?: Date;
}

export enum MachineStatus {
  AVAILABLE = 'available',
  IN_USE = 'in_use',
  MAINTENANCE = 'maintenance',
  OUT_OF_ORDER = 'out_of_order',
}

export enum MachineType {
  WASHER = 'washer',
  DRYER = 'dryer',
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
