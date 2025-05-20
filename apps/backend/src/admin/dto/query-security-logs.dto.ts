import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsDateString, IsNumber } from 'class-validator';
import { SecurityLogType } from '../entities/security-log.entity';

export class QuerySecurityLogsDto {
  @ApiProperty({
    description: 'Filter logs by type',
    enum: SecurityLogType,
    required: false,
  })
  @IsEnum(SecurityLogType)
  @IsOptional()
  type?: SecurityLogType;

  @ApiProperty({
    description: 'Filter logs by user ID',
    required: false,
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  userId?: number;

  @ApiProperty({
    description: 'Start date for log filtering (ISO string)',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({
    description: 'End date for log filtering (ISO string)',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  endDate?: string;
}
