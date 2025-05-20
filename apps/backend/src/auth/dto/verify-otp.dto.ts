import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsMobilePhone, Length } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({
    example: '+639171234567',
    description: 'Mobile number in E.164 format',
  })
  @IsString()
  @IsMobilePhone(
    'en-PH',
    {},
    { message: 'Please enter a valid Philippine mobile number' },
  )
  mobileNumber: string;

  @ApiProperty({
    example: '123456',
    description: '6-digit OTP code',
  })
  @IsString()
  @Length(6, 6, { message: 'OTP must be exactly 6 digits' })
  otp: string;
}
