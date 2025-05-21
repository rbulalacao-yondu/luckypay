import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { User } from '../users/entities/user.entity';
import { GamingMachine } from './entities/gaming-machine.entity';
import { CashIn } from './entities/cash-in.entity';
import { CoinIn } from './entities/coin-in.entity';
import { GamingMachineService } from './services/gaming-machine.service';
import { FinancialStatsService } from './services/financial-stats.service';
import { MachineAnalyticsService } from './services/machine-analytics.service';
import { GamingMachineController } from './controllers/gaming-machine.controller';
import { PlayersController } from './controllers/players.controller';
import { CashInsController } from './controllers/cash-ins.controller';
import { CoinInsController } from './controllers/coin-ins.controller';
import { DashboardController } from './controllers/dashboard.controller';
import { MachineAnalyticsController } from './controllers/machine-analytics.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, GamingMachine, CashIn, CoinIn]),
    ConfigModule,
    AuthModule,
  ],
  providers: [
    AdminService,
    GamingMachineService,
    FinancialStatsService,
    MachineAnalyticsService,
  ],
  controllers: [
    AdminController,
    GamingMachineController,
    PlayersController,
    CashInsController,
    CoinInsController,
    DashboardController,
    MachineAnalyticsController,
  ],
  exports: [
    AdminService,
    GamingMachineService,
    FinancialStatsService,
    MachineAnalyticsService,
  ],
})
export class AdminModule {}
