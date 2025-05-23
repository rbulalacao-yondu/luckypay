import { IsEmail, IsString, IsOptional, IsEnum, Length } from 'class-validator';
import { UserRole, UserStatus } from '../entities/user.entity';

export class CreateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  @Length(8, 20)
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
  @Length(6)
  password?: string;
}
