import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';

// Helper function to resolve paths
const resolvePath = (relativePath: string) => join(__dirname, relativePath);

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'luckypay',
  password: process.env.DB_PASSWORD || 'luckypay33',
  database: process.env.DB_DATABASE || 'luckypaydb',
  synchronize: false, // Disable synchronize in favor of migrations
  logging: process.env.NODE_ENV !== 'production',
  entities: [resolvePath('../**/*.entity.{js,ts}')],
  migrations: [resolvePath('../migrations/*.{js,ts}')],
  migrationsRun: false, // Let us control when migrations run
};

const dataSource = new DataSource({
  ...typeOrmConfig,
} as DataSourceOptions);

export default dataSource;
