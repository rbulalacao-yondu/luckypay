import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { OtpService } from './services/otp.service';
import { TokenService } from './services/token.service';
import { UserRole, UserStatus } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private otpService: OtpService,
    private tokenService: TokenService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException();
    }
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async requestOtp(mobileNumber: string): Promise<{ message: string }> {
    const user = await this.usersService.findByMobileNumber(mobileNumber);
    if (!user) {
      throw new UnauthorizedException('Invalid mobile number');
    }

    if (user.status === UserStatus.SUSPENDED) {
      throw new UnauthorizedException('Account is suspended');
    }

    const otp = await this.otpService.generateOtp(user);

    // In a real application, you would send this OTP via SMS
    // For development, we'll just return it in the response
    return {
      message: `OTP sent successfully: ${otp}`, // In production, remove the OTP from the message
    };
  }

  async verifyOtp(mobileNumber: string, otp: string) {
    const user = await this.usersService.findByMobileNumber(mobileNumber);
    if (!user) {
      throw new UnauthorizedException('Invalid mobile number');
    }

    const isValid = await this.otpService.validateOtp(user, otp);
    if (!isValid) {
      throw new UnauthorizedException('Invalid OTP');
    }

    if (user.status === UserStatus.PENDING_VERIFICATION) {
      user.status = UserStatus.ACTIVE;
      await this.usersService.update(user.id, user);
    }

    // Generate access and refresh tokens
    const tokens = await this.tokenService.generateTokens(user);

    return {
      ...tokens,
      user: {
        id: user.id,
        mobileNumber: user.mobileNumber,
        status: user.status,
        role: user.role,
      },
    };
  }

  async logout(userId: number): Promise<void> {
    const user = await this.usersService.findOne(userId);
    if (user) {
      // Clear OTP and revoke all active tokens
      await Promise.all([
        this.otpService.clearOtp(user),
        this.tokenService.revokeAllUserTokens(userId),
      ]);
    }
  }

  async refreshTokens(refreshToken: string) {
    return this.tokenService.refreshAccessToken(refreshToken);
  }

  generateToken(payload: { email: string; sub: number; role: string }) {
    return this.jwtService.sign(payload);
  }

  async validateAdminUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      console.log(`Admin validation failed: No user found with email ${email}`);
      return null;
    }

    // Check for any admin roles (admin, super_admin, finance_admin)
    const isAdminRole = [
      UserRole.ADMIN,
      UserRole.SUPER_ADMIN,
      UserRole.FINANCE_ADMIN,
    ].includes(user.role);

    if (!isAdminRole) {
      console.log(
        `Admin validation failed: User ${email} has non-admin role ${user.role}`,
      );
      return null;
    }

    if (user.status !== UserStatus.ACTIVE) {
      console.log(
        `Admin validation failed: User ${email} has status ${user.status}`,
      );
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password || '');
    if (!isPasswordValid) {
      console.log(
        `Admin validation failed: Invalid password for user ${email}`,
      );
      return null;
    }

    console.log(
      `Admin validation successful for user ${email} with role ${user.role}`,
    );

    const { password: _, ...result } = user;
    return result;
  }
}
