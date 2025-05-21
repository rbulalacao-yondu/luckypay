import { IsOptional, IsString, IsEmail, IsEnum } from 'class-validator';
import { UserRole, UserStatus } from '../../users/entities/user.entity';

export class CreateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  mobileNumber: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsEnum(UserStatus)
  status: UserStatus;

  @IsOptional()
  @IsString()
  password?: string;
}
