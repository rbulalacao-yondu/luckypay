import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check for existing user with same email or mobile
    if (createUserDto.email) {
      const existingEmail = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });
      if (existingEmail) {
        throw new ConflictException('Email already exists');
      }
    }

    const existingMobile = await this.userRepository.findOne({
      where: { mobileNumber: createUserDto.mobileNumber },
    });
    if (existingMobile) {
      throw new ConflictException('Mobile number already exists');
    }

    // Use transaction for user creation
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = this.userRepository.create(createUserDto);
      await queryRunner.manager.save(user);
      await queryRunner.commitTransaction();
      return user;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      select: [
        'id',
        'email',
        'mobileNumber',
        'firstName',
        'lastName',
        'status',
        'role',
        'isMobileVerified',
        'isEmailVerified',
        'createdAt',
        'updatedAt',
      ],
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: [
        'id',
        'email',
        'mobileNumber',
        'firstName',
        'lastName',
        'status',
        'role',
        'isMobileVerified',
        'isEmailVerified',
        'createdAt',
        'updatedAt',
        'lastLoginAt',
        'address',
        'dateOfBirth',
      ],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: number, updateData: Partial<User>): Promise<User> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await this.findOne(id);

      // Check email uniqueness if being updated
      if (updateData.email && updateData.email !== user.email) {
        const existingEmail = await this.userRepository.findOne({
          where: { email: updateData.email },
        });
        if (existingEmail) {
          throw new ConflictException('Email already exists');
        }
      }

      // Check mobile uniqueness if being updated
      if (
        updateData.mobileNumber &&
        updateData.mobileNumber !== user.mobileNumber
      ) {
        const existingMobile = await this.userRepository.findOne({
          where: { mobileNumber: updateData.mobileNumber },
        });
        if (existingMobile) {
          throw new ConflictException('Mobile number already exists');
        }
      }

      Object.assign(user, updateData);
      await queryRunner.manager.save(user);
      await queryRunner.commitTransaction();
      return user;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      select: [
        'id',
        'email',
        'password', // needed for auth
        'mobileNumber',
        'firstName',
        'lastName',
        'status',
        'role',
        'isMobileVerified',
        'isEmailVerified',
      ],
    });
  }

  async findByMobileNumber(mobileNumber: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { mobileNumber },
      select: [
        'id',
        'email',
        'password', // needed for auth
        'mobileNumber',
        'firstName',
        'lastName',
        'status',
        'role',
        'isMobileVerified',
        'isEmailVerified',
      ],
    });
  }
}
