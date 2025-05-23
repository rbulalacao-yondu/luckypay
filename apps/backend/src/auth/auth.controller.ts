import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  Request,
  Get,
  Req,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
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
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

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

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: 200,
    description: 'New access token generated successfully',
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        refreshToken: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        expiresIn: {
          type: 'number',
          example: 1621555555555,
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  async refreshToken(@Body() { refreshToken }: RefreshTokenDto) {
    const tokens = await this.authService.refreshTokens(refreshToken);
    if (!tokens) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
    return tokens;
  }

  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin login' })
  @ApiResponse({ status: 200, description: 'Admin logged in successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({ type: LoginDto })
  async adminLogin(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateAdminUser(
      loginDto.email,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid admin credentials');
    }

    // Log successful admin login
    console.log(
      `Admin login successful for user ${user.email} with role ${user.role}`,
    );

    // Prepare payload with explicit role that matches the Role enum
    // This is critical for the RolesGuard to work properly
    const role = user.role;
    console.log('Creating JWT token with role:', role);

    const payload = {
      email: user.email,
      role,
      // Add standard JWT claims
      type: 'access',
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '1d',
      subject: user.id.toString(),
    });

    const response = {
      accessToken,
      user: {
        id: user.id.toString(),
        email: user.email,
        role: user.role,
      },
    };

    return response;
  }

  @Get('debug/auth')
  @UseGuards(JwtAuthGuard)
  async debugAuth(@Req() req) {
    console.log('Debug Auth endpoint accessed');
    // Return user info from the request to verify what the JWT is providing
    return {
      message: 'Authentication working correctly',
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
        status: req.user.status,
      },
      // Don't include sensitive fields
    };
  }
}
