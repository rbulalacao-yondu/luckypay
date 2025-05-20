import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CasbinGuard } from '../auth/casbin/casbin.guard';
import { Resource, Action } from '../auth/casbin/casbin.decorators';
import { CasbinResource, CasbinAction } from '../auth/casbin/casbin.constants';
import { ApiResponse, User as SharedUser } from '@luckypay/shared-types';
import { User, UserRole } from './entities/user.entity';

@Controller('users')
@UseGuards(JwtAuthGuard, CasbinGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Resource(CasbinResource.USERS)
  @Action(CasbinAction.READ)
  async findAll(): Promise<ApiResponse<SharedUser[]>> {
    const users = await this.usersService.findAll();
    return {
      success: true,
      data: users.map((user) => ({
        ...user,
        id: user.id.toString(),
      })) as SharedUser[],
    };
  }

  @Post('admin/create')
  @Resource(CasbinResource.USERS)
  @Action(CasbinAction.CREATE)
  async createAdmin(
    @Body() createUserDto: any,
  ): Promise<ApiResponse<SharedUser>> {
    const user = await this.usersService.create({
      ...createUserDto,
      role: UserRole.FINANCE_ADMIN,
    });
    return {
      success: true,
      data: {
        ...user,
        id: user.id.toString(),
      } as SharedUser,
    };
  }

  @Post('loyalty-manager/create')
  @Resource(CasbinResource.USERS)
  @Action(CasbinAction.CREATE)
  async createLoyaltyManager(
    @Body() createUserDto: any,
  ): Promise<ApiResponse<SharedUser>> {
    const user = await this.usersService.create({
      ...createUserDto,
      role: UserRole.LOYALTY_MANAGER,
    });
    return {
      success: true,
      data: {
        ...user,
        id: user.id.toString(),
      } as SharedUser,
    };
  }

  @Get('transactions')
  @Resource(CasbinResource.TRANSACTIONS)
  @Action(CasbinAction.READ)
  async getUserTransactions(): Promise<ApiResponse<any>> {
    // Implementation to be added when transaction service is ready
    return {
      success: true,
      data: [],
    };
  }

  @Get('loyalty/status')
  @Resource(CasbinResource.LOYALTY)
  @Action(CasbinAction.READ)
  async getUserLoyaltyStatus(): Promise<ApiResponse<any>> {
    // Implementation to be added when loyalty service is ready
    return {
      success: true,
      data: {},
    };
  }
}
