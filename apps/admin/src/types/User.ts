export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
  FINANCE_ADMIN = 'finance_admin',
  LOYALTY_MANAGER = 'loyalty_manager',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING_VERIFICATION = 'pending_verification',
}

export enum LoyaltyTier {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum',
}

export interface User {
  id: number;
  email?: string;
  mobileNumber: string;
  firstName?: string;
  lastName?: string;
  status: UserStatus;
  role: UserRole;
  walletBalance: number;
  loyaltyTier: LoyaltyTier;
  loyaltyPoints: number;
  lastLoginAt?: Date;
  address?: string;
  dateOfBirth?: Date;
  isMobileVerified: boolean;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
