import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsMobilePhone } from 'class-validator';

export class RequestOtpDto {
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
}
