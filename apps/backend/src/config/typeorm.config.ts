import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { SecurityLog } from '../admin/entities/security-log.entity';
import { GamingMachine } from '../admin/entities/gaming-machine.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'luckypay',
  password: process.env.DB_PASSWORD || 'luckypay33',
  database: process.env.DB_DATABASE || 'luckypaydb',
  synchronize: true, // Temporarily enable synchronize to create tables
  logging: process.env.NODE_ENV !== 'production',
  entities: [User, SecurityLog, GamingMachine],
  migrations: [__dirname + '/../migrations/*.{js,ts}'],
  migrationsRun: true,
};

export default new DataSource({
  ...typeOrmConfig,
  migrations: [__dirname + '/../migrations/*.{js,ts}'],
} as DataSourceOptions);
