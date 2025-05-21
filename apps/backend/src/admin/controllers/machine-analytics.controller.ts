import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/rbac/roles.guard';
import { Roles } from '../../auth/rbac/roles.decorator';
import { Role } from '../../auth/rbac/roles.enum';
import { MachineAnalyticsService } from '../services/machine-analytics.service';

@Controller('admin/machine-analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MachineAnalyticsController {
  constructor(
    private readonly machineAnalyticsService: MachineAnalyticsService,
  ) {}

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.FINANCE_ADMIN)
  async getMachineAnalytics(@Query('days') days: number) {
    return this.machineAnalyticsService.getMachinePerformance(days);
  }
}
