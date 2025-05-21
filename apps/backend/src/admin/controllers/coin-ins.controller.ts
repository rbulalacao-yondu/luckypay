import {
  Controller,
  Get,
  Query,
  Param,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { AdminService } from '../admin.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../../auth/guards/role.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('admin/coin-ins')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles('admin')
export class CoinInsController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('machineId') machineId?: string,
    @Query('gameType') gameType?: string,
  ) {
    return this.adminService.findAllCoinIns({
      page,
      limit,
      search,
      fromDate,
      toDate,
      machineId,
      gameType,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const coinIn = await this.adminService.findOneCoinIn(id);
    if (!coinIn) {
      throw new NotFoundException(`Coin-in #${id} not found`);
    }
    return coinIn;
  }
}
