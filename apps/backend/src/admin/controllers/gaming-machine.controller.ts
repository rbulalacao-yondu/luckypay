import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/rbac/roles.guard';
import { Roles } from '../../auth/rbac/roles.decorator';
import { Role } from '../../auth/rbac/roles.enum';
import { GamingMachineService } from '../services/gaming-machine.service';
import { GamingMachine } from '../entities/gaming-machine.entity';

@Controller('admin/gaming-machines')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GamingMachineController {
  constructor(private readonly gamingMachineService: GamingMachineService) {}

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.FINANCE_ADMIN)
  async findAll(): Promise<GamingMachine[]> {
    return this.gamingMachineService.findAll();
  }

  @Get('search')
  @Roles(Role.SUPER_ADMIN, Role.FINANCE_ADMIN)
  async search(@Query('q') query: string): Promise<GamingMachine[]> {
    return this.gamingMachineService.search(query);
  }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN, Role.FINANCE_ADMIN)
  async findOne(@Param('id') id: string): Promise<GamingMachine> {
    return this.gamingMachineService.findOne(id);
  }
}
