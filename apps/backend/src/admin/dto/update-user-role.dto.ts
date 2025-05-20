import { IsEnum, IsNumber } from 'class-validator';
import { UserRole } from '../../users/entities/user.entity';

export class UpdateUserRoleDto {
  @IsNumber()
  userId: number;

  @IsEnum(UserRole)
  role: UserRole;
}
