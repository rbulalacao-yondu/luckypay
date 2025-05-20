import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/rbac/roles.guard';
import { Roles } from '../auth/rbac/roles.decorator';
import { Role } from '../auth/rbac/roles.enum';
import { UserRole } from '../users/entities/user.entity';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  @Roles(Role.SUPER_ADMIN)
  async getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Get('users/by-role')
  @Roles(Role.SUPER_ADMIN)
  async getUsersByRole(@Query('role') role: UserRole) {
    return this.adminService.getUsersByRole(role);
  }

  @Put('users/role')
  @Roles(Role.SUPER_ADMIN)
  async updateUserRole(
    @Body() updateUserRoleDto: UpdateUserRoleDto,
    @Req() req,
  ) {
    return this.adminService.updateUserRole(updateUserRoleDto, req.user.role);
  }
}
