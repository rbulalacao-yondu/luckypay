import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../users/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { CashIn } from './entities/cash-in.entity';
import { CoinIn } from './entities/coin-in.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(CashIn)
    private readonly cashInRepository: Repository<CashIn>,
    @InjectRepository(CoinIn)
    private readonly coinInRepository: Repository<CoinIn>,
    private readonly configService: ConfigService,
  ) {}

  // User Management Methods
  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find({
      select: [
        'id',
        'email',
        'mobileNumber',
        'firstName',
        'lastName',
        'status',
        'role',
        'walletBalance',
        'loyaltyTier',
        'loyaltyPoints',
        'lastLoginAt',
        'isMobileVerified',
        'isEmailVerified',
        'createdAt',
        'updatedAt',
      ],
    });
  }

  async getUser(id: number): Promise<User> {
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
        'walletBalance',
        'loyaltyTier',
        'loyaltyPoints',
        'lastLoginAt',
        'isMobileVerified',
        'isEmailVerified',
        'createdAt',
        'updatedAt',
        'address',
        'dateOfBirth',
      ],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    if (createUserDto.password) {
      user.password = await bcrypt.hash(createUserDto.password, 10);
    }
    return this.userRepository.save(user);
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.getUser(id);

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.getUser(id);
    await this.userRepository.remove(user);
  }

  async updateUserRole(
    updateUserRoleDto: UpdateUserRoleDto,
    adminRole: UserRole,
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: updateUserRoleDto.userId },
    });

    if (!user) {
      throw new NotFoundException(
        `User with ID ${updateUserRoleDto.userId} not found`,
      );
    }

    // Check role hierarchy
    if (!this.canUpdateRole(adminRole, user.role, updateUserRoleDto.role)) {
      throw new ForbiddenException(
        'You do not have permission to update to this role',
      );
    }

    user.role = updateUserRoleDto.role;
    return this.userRepository.save(user);
  }

  async getUsersByRole(role: UserRole): Promise<User[]> {
    return this.userRepository.find({
      where: { role },
      select: [
        'id',
        'email',
        'mobileNumber',
        'firstName',
        'lastName',
        'status',
        'role',
        'walletBalance',
        'loyaltyTier',
        'loyaltyPoints',
        'lastLoginAt',
      ],
    });
  }

  private canUpdateRole(
    adminRole: UserRole,
    currentRole: UserRole,
    newRole: UserRole,
  ): boolean {
    const roleHierarchy = {
      [UserRole.SUPER_ADMIN]: 4,
      [UserRole.ADMIN]: 3,
      [UserRole.FINANCE_ADMIN]: 2,
      [UserRole.LOYALTY_MANAGER]: 2,
      [UserRole.USER]: 1,
    };

    const adminLevel = roleHierarchy[adminRole];
    const currentLevel = roleHierarchy[currentRole];
    const newLevel = roleHierarchy[newRole];

    // Admin can only update roles of lower level
    return adminLevel > currentLevel && adminLevel > newLevel;
  }

  // Cash-in Management Methods
  async getCashIns() {
    return this.cashInRepository.find({
      relations: ['user'],
      order: { timestamp: 'DESC' },
    });
  }

  async searchCashIns(query: string) {
    if (!query) return this.getCashIns();

    return this.cashInRepository
      .createQueryBuilder('cashIn')
      .leftJoinAndSelect('cashIn.user', 'user')
      .where('user.firstName LIKE :query', { query: `%${query}%` })
      .orWhere('user.lastName LIKE :query', { query: `%${query}%` })
      .orWhere('user.mobileNumber LIKE :query', { query: `%${query}%` })
      .orWhere('cashIn.referenceId LIKE :query', { query: `%${query}%` })
      .orderBy('cashIn.timestamp', 'DESC')
      .getMany();
  }

  async getCashIn(id: string) {
    const cashIn = await this.cashInRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!cashIn) {
      throw new NotFoundException(`Cash-in with ID ${id} not found`);
    }

    return cashIn;
  }

  // Coin-in Management Methods
  async findAllCoinIns({
    page = 1,
    limit = 10,
    search,
    fromDate,
    toDate,
    machineId,
    gameType,
  }) {
    const query = this.coinInRepository
      .createQueryBuilder('coinIn')
      .leftJoinAndSelect('coinIn.user', 'user')
      .leftJoinAndSelect('coinIn.machine', 'machine');

    if (search) {
      query.andWhere(
        '(user.username LIKE :search OR machine.name LIKE :search)',
        {
          search: `%${search}%`,
        },
      );
    }

    if (fromDate && toDate) {
      query.andWhere('coinIn.timestamp BETWEEN :fromDate AND :toDate', {
        fromDate,
        toDate,
      });
    }

    if (machineId) {
      query.andWhere('coinIn.machineId = :machineId', { machineId });
    }

    if (gameType) {
      query.andWhere('coinIn.gameType = :gameType', { gameType });
    }

    const [items, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('coinIn.timestamp', 'DESC')
      .getManyAndCount();

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOneCoinIn(id: string) {
    return this.coinInRepository.findOne({
      where: { id },
      relations: ['user', 'machine'],
    });
  }

  // Player Management Methods
  async getPlayers(): Promise<User[]> {
    return this.userRepository.find({
      where: { role: UserRole.USER },
      select: [
        'id',
        'email',
        'mobileNumber',
        'firstName',
        'lastName',
        'status',
        'walletBalance',
        'loyaltyTier',
        'loyaltyPoints',
        'lastLoginAt',
      ],
    });
  }

  async searchPlayers(query: string): Promise<User[]> {
    if (!query) return this.getPlayers();

    return this.userRepository
      .createQueryBuilder('user')
      .where('user.role = :role', { role: UserRole.USER })
      .andWhere(
        '(user.firstName LIKE :query OR user.lastName LIKE :query OR user.mobileNumber LIKE :query OR user.email LIKE :query)',
        { query: `%${query}%` },
      )
      .select([
        'user.id',
        'user.email',
        'user.mobileNumber',
        'user.firstName',
        'user.lastName',
        'user.status',
        'user.walletBalance',
        'user.loyaltyTier',
        'user.loyaltyPoints',
        'user.lastLoginAt',
      ])
      .getMany();
  }

  async getPlayer(id: number): Promise<User> {
    const player = await this.userRepository.findOne({
      where: { id, role: UserRole.USER },
      select: [
        'id',
        'email',
        'mobileNumber',
        'firstName',
        'lastName',
        'status',
        'walletBalance',
        'loyaltyTier',
        'loyaltyPoints',
        'lastLoginAt',
        'isMobileVerified',
        'isEmailVerified',
        'createdAt',
        'updatedAt',
        'address',
        'dateOfBirth',
      ],
    });

    if (!player) {
      throw new NotFoundException(`Player with ID ${id} not found`);
    }
    return player;
  }
}
