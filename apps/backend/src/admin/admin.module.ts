import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { User } from '../users/entities/user.entity';
import { SecurityLog } from './entities/security-log.entity';
import { GamingMachine } from './entities/gaming-machine.entity';
import { CashIn } from './entities/cash-in.entity';
import { GamingMachineService } from './services/gaming-machine.service';
import { GamingMachineController } from './controllers/gaming-machine.controller';
import { PlayersController } from './controllers/players.controller';
import { CashInsController } from './controllers/cash-ins.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, SecurityLog, GamingMachine, CashIn]),
    ConfigModule,
    AuthModule,
  ],
  providers: [AdminService, GamingMachineService],
  controllers: [
    AdminController,
    GamingMachineController,
    PlayersController,
    CashInsController,
  ],
  exports: [AdminService, GamingMachineService],
})
export class AdminModule {}
