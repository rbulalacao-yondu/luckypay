import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

class RequestOtpDto {
  mobileNumber: string;
}

class VerifyOtpDto {
  mobileNumber: string;
  otp: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('request-otp')
  async requestOtp(@Body() { mobileNumber }: RequestOtpDto) {
    return this.authService.requestOtp(mobileNumber);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() { mobileNumber, otp }: VerifyOtpDto) {
    return this.authService.verifyOtp(mobileNumber, otp);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req) {
    return this.authService.logout(req.user.sub);
  }
}
