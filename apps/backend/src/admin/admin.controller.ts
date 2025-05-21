import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  UseGuards,
  Query,
  Req,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/rbac/roles.guard';
import { Roles } from '../auth/rbac/roles.decorator';
import { Role } from '../auth/rbac/roles.enum';
import { UserRole } from '../users/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async getAllUsers() {
    console.log('Accessing getAllUsers endpoint');
    return this.adminService.getAllUsers();
  }

  @Get('users/by-role')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async getUsersByRole(@Query('role') role: UserRole) {
    console.log('Accessing getUsersByRole endpoint with role:', role);
    return this.adminService.getUsersByRole(role);
  }

  @Put('users/role')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async updateUserRole(
    @Body() updateUserRoleDto: UpdateUserRoleDto,
    @Req() req,
  ) {
    console.log(
      'Updating user role:',
      updateUserRoleDto,
      'by admin:',
      req.user.email,
    );
    return this.adminService.updateUserRole(updateUserRoleDto, req.user.role);
  }

  // Transaction Management Endpoints
  /*
  @Get('transactions/overview')
  @Roles(Role.SUPER_ADMIN, Role.FINANCE_ADMIN)
  async getTransactionOverview() {
    return this.adminService.getTransactionOverview();
  }

  @Get('transactions/stats')
  @Roles(Role.SUPER_ADMIN, Role.FINANCE_ADMIN)
  async getTransactionStats(@Query() query: TransactionQueryDto) {
    return this.adminService.getTransactionStats(
      query.startDate
        ? new Date(query.startDate)
        : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      query.endDate ? new Date(query.endDate) : new Date(),
    );
  }*/

  // Loyalty Program Management Endpoints
  /*
  @Get('loyalty/settings')
  @Roles(Role.SUPER_ADMIN, Role.LOYALTY_MANAGER)
  async getLoyaltyProgramSettings() {
    return this.adminService.getLoyaltyProgramSettings();
  }

  @Put('loyalty/settings')
  @Roles(Role.SUPER_ADMIN, Role.LOYALTY_MANAGER)
  async updateLoyaltyProgramSettings(
    @Body() settings: UpdateLoyaltySettingsDto,
  ) {
    return this.adminService.updateLoyaltyProgramSettings(settings);
  }

  @Get('loyalty/metrics')
  @Roles(Role.SUPER_ADMIN, Role.LOYALTY_MANAGER)
  async getLoyaltyMetrics() {
    return this.adminService.getLoyaltyMetrics();
  }*/

  @Get('users/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async getUser(@Param('id', ParseIntPipe) id: number) {
    console.log('Accessing getUser endpoint for id:', id);
    return this.adminService.getUser(id);
  }

  @Post('users')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async createUser(@Body() createUserDto: CreateUserDto) {
    console.log('Creating new user:', createUserDto);
    return this.adminService.createUser(createUserDto);
  }

  @Put('users/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    console.log('Updating user:', id, updateUserDto);
    return this.adminService.updateUser(id, updateUserDto);
  }

  @Delete('users/:id')
  @Roles(Role.SUPER_ADMIN)
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    console.log('Deleting user:', id);
    await this.adminService.deleteUser(id);
    return { message: 'User deleted successfully' };
  }
}
