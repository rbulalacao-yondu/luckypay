import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min, Max } from 'class-validator';

export class OtpConfigDto {
  @ApiProperty({
    description: 'OTP expiry time in minutes',
    example: 5,
    minimum: 1,
    maximum: 30,
  })
  @IsNumber()
  @Min(1)
  @Max(30)
  @IsOptional()
  expiryMinutes?: number;

  @ApiProperty({
    description: 'Maximum number of OTP attempts before lockout',
    example: 3,
    minimum: 1,
    maximum: 10,
  })
  @IsNumber()
  @Min(1)
  @Max(10)
  @IsOptional()
  maxAttempts?: number;
}
