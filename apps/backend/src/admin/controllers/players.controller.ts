import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/rbac/roles.guard';
import { Roles } from '../../auth/rbac/roles.decorator';
import { Role } from '../../auth/rbac/roles.enum';
import { AdminService } from '../admin.service';

@Controller('admin/players')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPER_ADMIN)
export class PlayersController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  async getAllPlayers() {
    return this.adminService.getPlayers();
  }

  @Get('search')
  async searchPlayers(@Query('q') query: string) {
    return this.adminService.searchPlayers(query);
  }

  @Get(':id')
  async getPlayer(@Param('id') id: string) {
    return this.adminService.getPlayer(parseInt(id, 10));
  }
}
