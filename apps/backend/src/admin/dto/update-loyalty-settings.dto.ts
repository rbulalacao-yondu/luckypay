import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class LoyaltyTierDto {
  @ApiProperty({ example: 'Gold', description: 'Name of the loyalty tier' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 5000,
    description: 'Points required to reach this tier',
  })
  @IsNumber()
  pointThreshold: number;

  @ApiProperty({
    example: ['Free drinks', '10% bonus points'],
    description: 'List of benefits for this tier',
  })
  @IsArray()
  @IsString({ each: true })
  benefits: string[];
}

export class UpdateLoyaltySettingsDto {
  @ApiProperty({
    type: [LoyaltyTierDto],
    description: 'List of loyalty tiers with their settings',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LoyaltyTierDto)
  tiers: LoyaltyTierDto[];

  @ApiProperty({
    example: 1,
    description: 'Number of points earned per peso spent',
  })
  @IsNumber()
  pointsPerPeso: number;

  @ApiProperty({
    example: 365,
    description: 'Number of days before points expire',
  })
  @IsNumber()
  expiryDays: number;

  @ApiProperty({
    example: true,
    description: 'Whether to notify users about tier changes',
    required: false,
  })
  @IsOptional()
  notifyTierChanges?: boolean;
}
