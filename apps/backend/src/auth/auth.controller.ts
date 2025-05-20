import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(ThrottlerGuard)
  @Post('request-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request OTP for mobile number' })
  @ApiBody({ type: RequestOtpDto })
  @ApiResponse({
    status: 200,
    description: 'OTP sent successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'OTP sent successfully',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid mobile number' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async requestOtp(@Body() { mobileNumber }: RequestOtpDto) {
    return this.authService.requestOtp(mobileNumber);
  }

  @UseGuards(ThrottlerGuard)
  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify OTP for mobile number' })
  @ApiBody({ type: VerifyOtpDto })
  @ApiResponse({
    status: 200,
    description: 'OTP verified successfully',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        user: {
          type: 'object',
          properties: {
            id: {
              type: 'number',
              example: 1,
            },
            mobileNumber: {
              type: 'string',
              example: '+639171234567',
            },
            status: {
              type: 'string',
              example: 'ACTIVE',
            },
            role: {
              type: 'string',
              example: 'USER',
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid OTP or mobile number' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async verifyOtp(@Body() { mobileNumber, otp }: VerifyOtpDto) {
    return this.authService.verifyOtp(mobileNumber, otp);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req) {
    return this.authService.logout(req.user.sub);
  }
}
