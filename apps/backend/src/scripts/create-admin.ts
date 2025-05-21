import { Command } from 'commander';
import * as bcrypt from 'bcrypt';
import { DataSource, DataSourceOptions } from 'typeorm';
import { User, UserRole, UserStatus } from '../users/entities/user.entity';

const config: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'luckypay',
  password: process.env.DB_PASSWORD || 'luckypay33',
  database: process.env.DB_DATABASE || 'luckypaydb',
  entities: [User],
  synchronize: process.env.NODE_ENV !== 'production',
};

async function createAdminUser() {
  const email = 'admin@luckypay.com';
  const mobileNumber = '+639123456789';
  const password = 'admin123'; // Change this in production!

  try {
    console.log('Connecting to database...');
    const dataSource = new DataSource(config);
    await dataSource.initialize();
    console.log('Database connected successfully');

    const userRepository = dataSource.getRepository(User);

    // Check if admin already exists
    const existingAdmin = await userRepository.findOne({
      where: { email },
    });

    if (existingAdmin) {
      console.log('Admin user already exists');
      await dataSource.destroy();
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const admin = userRepository.create({
      email,
      mobileNumber,
      password: hashedPassword,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    });

    await userRepository.save(admin);

    console.log('Admin user created successfully');
    console.log('Email:', email);
    console.log('Mobile:', mobileNumber);
    console.log('Password:', password);

    await dataSource.destroy();
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

const program = new Command();

program
  .command('create-admin')
  .description('Create admin user')
  .action(createAdminUser);

program.parse(process.argv);
