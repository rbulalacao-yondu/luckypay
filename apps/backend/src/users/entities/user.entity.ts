import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Exclude } from 'class-transformer';

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

@Entity('users')
@Index(['email'], { unique: true, where: 'email IS NOT NULL' })
@Index(['status', 'role']) // For filtering users by status and role
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  @Index()
  email?: string;

  @Column()
  @Index({ unique: true })
  mobileNumber: string;

  @Exclude()
  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.PENDING_VERIFICATION,
  })
  status: UserStatus;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  // OTP related fields
  @Column({ nullable: true })
  @Exclude()
  currentOtp?: string;

  @Column({ nullable: true })
  @Exclude()
  otpExpiresAt?: Date;

  @Column({ default: 0 })
  @Exclude()
  otpAttempts: number;

  // Wallet related fields
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  walletBalance: number;

  // Loyalty program fields
  @Column({ type: 'enum', enum: LoyaltyTier, default: LoyaltyTier.BRONZE })
  loyaltyTier: LoyaltyTier;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  loyaltyPoints: number;

  // Security and device fields
  @Column({ nullable: true })
  lastLoginAt?: Date;

  @Column({ nullable: true })
  lastLoginIp?: string;

  @Column({ nullable: true })
  deviceId?: string;

  @Column({ type: 'simple-array', nullable: true })
  fcmTokens?: string[];

  @Column({ nullable: true })
  avatar?: string;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @Column({ nullable: true })
  dateOfBirth?: Date;

  @Column({ default: false })
  isMobileVerified: boolean;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ type: 'simple-json', nullable: true })
  preferences?: {
    notifications: boolean;
    marketingEmails: boolean;
    language: string;
    theme: string;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
