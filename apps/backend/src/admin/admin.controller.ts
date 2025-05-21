import {
  Controller,
  Get,
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
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { OtpConfigDto } from './dto/otp-config.dto';
import { UpdateLoyaltySettingsDto } from './dto/update-loyalty-settings.dto';
import { TransactionQueryDto } from './dto/transaction-query.dto';
import { QuerySecurityLogsDto } from './dto/query-security-logs.dto';
import { SecurityLogType } from './entities/security-log.entity';

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

  @Get('otp/settings')
  @Roles(Role.SUPER_ADMIN)
  async getOtpSettings() {
    return this.adminService.getOtpSettings();
  }

  @Put('otp/settings')
  @Roles(Role.SUPER_ADMIN)
  async updateOtpSettings(@Body() config: OtpConfigDto) {
    return this.adminService.updateOtpSettings(config);
  }

  @Delete('otp/:userId')
  @Roles(Role.SUPER_ADMIN)
  async revokeUserOtp(@Param('userId', ParseIntPipe) userId: number) {
    await this.adminService.revokeUserOtp(userId);
    return { message: 'OTP revoked successfully' };
  }

  @Get('otp/pending')
  @Roles(Role.SUPER_ADMIN)
  async getPendingOtps() {
    return this.adminService.getPendingOtps();
  }

  @Get('security-logs')
  @Roles(Role.SUPER_ADMIN, Role.FINANCE_ADMIN)
  async getSecurityLogs(@Query() query: QuerySecurityLogsDto) {
    console.log('Accessing security logs with query:', query);
    return this.adminService.getSecurityLogs(query);
  }

  @Get('security-logs/type/:type')
  @Roles(Role.SUPER_ADMIN, Role.FINANCE_ADMIN)
  async getSecurityLogsByType(@Param('type') type: SecurityLogType) {
    console.log('Accessing security logs by type:', type);
    return this.adminService.getSecurityLogsByType(type);
  }

  @Get('security-logs/user/:userId')
  @Roles(Role.SUPER_ADMIN, Role.FINANCE_ADMIN)
  async getSecurityLogsByUser(@Param('userId', ParseIntPipe) userId: number) {
    console.log('Accessing security logs for user:', userId);
    return this.adminService.getSecurityLogsByUser(userId);
  }

  // Transaction Management Endpoints
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
  }

  // Loyalty Program Management Endpoints
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
  }
}
