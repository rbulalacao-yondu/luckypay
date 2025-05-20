import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OtpService {
  private readonly OTP_EXPIRY_MINUTES = 5;
  private readonly MAX_OTP_ATTEMPTS = 3;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  private generateRandomOtp(): string {
    // Generate a cryptographically secure 6-digit OTP
    const buffer = crypto.randomBytes(3); // 3 bytes = 6 digits
    const number = buffer.readUIntBE(0, 3);
    return String(number % 1000000).padStart(6, '0');
  }

  async generateOtp(user: User): Promise<string> {
    // Generate a 6-digit OTP
    const otp = this.generateRandomOtp();

    // Update user with new OTP
    user.currentOtp = otp;
    user.otpExpiresAt = new Date(Date.now() + this.OTP_EXPIRY_MINUTES * 60000);
    user.otpAttempts = 0;

    await this.userRepository.save(user);

    return otp;
  }

  async validateOtp(user: User, otp: string): Promise<boolean> {
    // Check if OTP exists
    if (!user.currentOtp) {
      throw new BadRequestException('No OTP request found');
    }

    // Check if OTP has expired
    if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      throw new UnauthorizedException('OTP has expired');
    }

    // Check if max attempts exceeded
    if (user.otpAttempts >= this.MAX_OTP_ATTEMPTS) {
      throw new UnauthorizedException('Maximum OTP attempts exceeded');
    }

    // Use timing-safe comparison to prevent timing attacks
    const isValid = crypto.timingSafeEqual(
      Buffer.from(user.currentOtp),
      Buffer.from(otp),
    );

    // Update attempts
    user.otpAttempts += 1;

    if (isValid) {
      // Clear OTP fields on successful validation
      user.currentOtp = undefined;
      user.otpExpiresAt = undefined;
      user.otpAttempts = 0;
    }

    await this.userRepository.save(user);

    return isValid;
  }

  async clearOtp(user: User): Promise<void> {
    user.currentOtp = undefined;
    user.otpExpiresAt = undefined;
    user.otpAttempts = 0;
    await this.userRepository.save(user);
  }
}
