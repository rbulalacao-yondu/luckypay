import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/entities/user.entity';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find({
      select: [
        'id',
        'email',
        'mobileNumber',
        'firstName',
        'lastName',
        'status',
        'role',
        'walletBalance',
        'loyaltyTier',
        'loyaltyPoints',
        'lastLoginAt',
      ],
    });
  }

  async updateUserRole(
    updateUserRoleDto: UpdateUserRoleDto,
    adminRole: UserRole,
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: updateUserRoleDto.userId },
    });

    if (!user) {
      throw new NotFoundException(
        `User with ID ${updateUserRoleDto.userId} not found`,
      );
    }

    // Check role hierarchy
    if (!this.canUpdateRole(adminRole, user.role, updateUserRoleDto.role)) {
      throw new ForbiddenException(
        'You do not have permission to update to this role',
      );
    }

    user.role = updateUserRoleDto.role;
    return this.userRepository.save(user);
  }

  async getUsersByRole(role: UserRole): Promise<User[]> {
    return this.userRepository.find({
      where: { role },
      select: [
        'id',
        'email',
        'mobileNumber',
        'firstName',
        'lastName',
        'status',
        'role',
        'walletBalance',
        'loyaltyTier',
        'loyaltyPoints',
        'lastLoginAt',
      ],
    });
  }

  private canUpdateRole(
    adminRole: UserRole,
    currentRole: UserRole,
    newRole: UserRole,
  ): boolean {
    const roleHierarchy = {
      [UserRole.SUPER_ADMIN]: 4,
      [UserRole.ADMIN]: 3,
      [UserRole.FINANCE_ADMIN]: 2,
      [UserRole.LOYALTY_MANAGER]: 2,
      [UserRole.USER]: 1,
    };

    const adminLevel = roleHierarchy[adminRole];
    const currentLevel = roleHierarchy[currentRole];
    const newLevel = roleHierarchy[newRole];

    // Admin can only update roles of lower level
    return adminLevel > currentLevel && adminLevel > newLevel;
  }
}
