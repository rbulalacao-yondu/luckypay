import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Not, IsNull, MoreThan } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User, UserRole } from '../users/entities/user.entity';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { OtpConfigDto } from './dto/otp-config.dto';
import { OtpService } from '../auth/services/otp.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly otpService: OtpService,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find({
      select: [
        'id',
        'email',
        'mobileNumber',
        'firstName',
        'lastName',
        'status',
        'role',
        'walletBalance',
        'loyaltyTier',
        'loyaltyPoints',
        'lastLoginAt',
      ],
    });
  }

  async updateUserRole(
    updateUserRoleDto: UpdateUserRoleDto,
    adminRole: UserRole,
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: updateUserRoleDto.userId },
    });

    if (!user) {
      throw new NotFoundException(
        `User with ID ${updateUserRoleDto.userId} not found`,
      );
    }

    // Check role hierarchy
    if (!this.canUpdateRole(adminRole, user.role, updateUserRoleDto.role)) {
      throw new ForbiddenException(
        'You do not have permission to update to this role',
      );
    }

    user.role = updateUserRoleDto.role;
    return this.userRepository.save(user);
  }

  async getUsersByRole(role: UserRole): Promise<User[]> {
    return this.userRepository.find({
      where: { role },
      select: [
        'id',
        'email',
        'mobileNumber',
        'firstName',
        'lastName',
        'status',
        'role',
        'walletBalance',
        'loyaltyTier',
        'loyaltyPoints',
        'lastLoginAt',
      ],
    });
  }

  private canUpdateRole(
    adminRole: UserRole,
    currentRole: UserRole,
    newRole: UserRole,
  ): boolean {
    const roleHierarchy = {
      [UserRole.SUPER_ADMIN]: 4,
      [UserRole.ADMIN]: 3,
      [UserRole.FINANCE_ADMIN]: 2,
      [UserRole.LOYALTY_MANAGER]: 2,
      [UserRole.USER]: 1,
    };

    const adminLevel = roleHierarchy[adminRole];
    const currentLevel = roleHierarchy[currentRole];
    const newLevel = roleHierarchy[newRole];

    // Admin can only update roles of lower level
    return adminLevel > currentLevel && adminLevel > newLevel;
  }

  async getOtpSettings() {
    return {
      expiryMinutes: this.configService.get<number>('otpExpiryMinutes'),
      maxAttempts: this.configService.get<number>('maxOtpAttempts'),
    };
  }

  async updateOtpSettings(config: OtpConfigDto) {
    if (config.expiryMinutes) {
      process.env.OTP_EXPIRY_MINUTES = config.expiryMinutes.toString();
    }
    if (config.maxAttempts) {
      process.env.MAX_OTP_ATTEMPTS = config.maxAttempts.toString();
    }
    return this.getOtpSettings();
  }

  async revokeUserOtp(userId: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    await this.otpService.clearOtp(user);
  }

  async getPendingOtps() {
    const users = await this.userRepository.find({
      where: {
        currentOtp: Not(IsNull()),
        otpExpiresAt: MoreThan(new Date()),
      },
      select: ['id', 'mobileNumber', 'otpExpiresAt', 'otpAttempts'],
    });

    return users.map((user) => ({
      userId: user.id,
      mobileNumber: user.mobileNumber,
      expiresAt: user.otpExpiresAt,
      attempts: user.otpAttempts,
    }));
  }
}
