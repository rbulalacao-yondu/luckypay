import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/rbac/roles.guard';
import { Roles } from '../../auth/rbac/roles.decorator';
import { Role } from '../../auth/rbac/roles.enum';
import { FinancialStatsService } from '../services/financial-stats.service';

@Controller('admin/dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly financialStatsService: FinancialStatsService) {}

  @Get('financial-stats')
  @Roles(Role.SUPER_ADMIN, Role.FINANCE_ADMIN)
  async getFinancialStats() {
    return this.financialStatsService.getFinancialStats();
  }
}
