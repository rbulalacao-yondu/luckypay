import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/rbac/roles.guard';
import { Roles } from '../../auth/rbac/roles.decorator';
import { Role } from '../../auth/rbac/roles.enum';
import { AdminService } from '../admin.service';

@Controller('admin/cash-ins')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.FINANCE_ADMIN)
export class CashInsController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  async getAllCashIns() {
    return this.adminService.getCashIns();
  }

  @Get('search')
  async searchCashIns(@Query('q') query: string) {
    return this.adminService.searchCashIns(query);
  }

  @Get(':id')
  async getCashIn(@Param('id') id: string) {
    return this.adminService.getCashIn(id);
  }
}
