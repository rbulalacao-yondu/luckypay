import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { User } from '../users/entities/user.entity';
import { SecurityLog } from './entities/security-log.entity';
import { GamingMachine } from './entities/gaming-machine.entity';
import { GamingMachineService } from './services/gaming-machine.service';
import { GamingMachineController } from './controllers/gaming-machine.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, SecurityLog, GamingMachine]),
    ConfigModule,
    AuthModule,
  ],
  providers: [AdminService, GamingMachineService],
  controllers: [AdminController, GamingMachineController],
  exports: [AdminService, GamingMachineService],
})
export class AdminModule {}
