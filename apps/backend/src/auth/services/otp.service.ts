import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
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
  ) {
    // Configure OTP settings
    authenticator.options = {
      window: 1, // Allow 1 step drift for time-based tokens
      step: 30, // 30 second step
    };
  }

  async generateOtp(user: User): Promise<string> {
    // Generate a 6-digit OTP
    const otp = authenticator.generateToken(
      this.configService.get('OTP_SECRET') || 'defaultSecret',
    );

    // Update user with new OTP
    user.currentOtp = otp;
    user.otpExpiresAt = new Date(Date.now() + this.OTP_EXPIRY_MINUTES * 60000);
    user.otpAttempts = 0;

    await this.userRepository.save(user);

    return otp;
  }

  async validateOtp(user: User, otp: string): Promise<boolean> {
    // Check if OTP has expired
    if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      throw new Error('OTP has expired');
    }

    // Check if max attempts exceeded
    if (user.otpAttempts >= this.MAX_OTP_ATTEMPTS) {
      throw new Error('Maximum OTP attempts exceeded');
    }

    // Verify OTP
    const isValid = user.currentOtp === otp;

    // Update attempts
    user.otpAttempts += 1;

    if (isValid) {
      // Clear OTP fields on successful validation
      user.currentOtp = null;
      user.otpExpiresAt = null;
      user.otpAttempts = 0;
    }

    await this.userRepository.save(user);

    return isValid;
  }

  async clearOtp(user: User): Promise<void> {
    user.currentOtp = null;
    user.otpExpiresAt = null;
    user.otpAttempts = 0;
    await this.userRepository.save(user);
  }
}
