import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/rbac/roles.guard';
import { Roles } from '../../auth/rbac/roles.decorator';
import { Role } from '../../auth/rbac/roles.enum';
import { PlayerAnalyticsService } from '../services/player-analytics.service';

@Controller('admin/dashboard/player-analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PlayerAnalyticsController {
  constructor(
    private readonly playerAnalyticsService: PlayerAnalyticsService,
  ) {}

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async getPlayerAnalytics(@Query('days') days: number) {
    return this.playerAnalyticsService.getPlayerAnalytics(days);
  }
}
