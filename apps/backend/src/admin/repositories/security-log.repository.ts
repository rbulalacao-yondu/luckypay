import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SecurityLog } from '../entities/security-log.entity';

@Injectable()
export class SecurityLogRepository {
  constructor(
    @InjectRepository(SecurityLog)
    private readonly repository: Repository<SecurityLog>,
  ) {}

  async findOne(options: any): Promise<SecurityLog | null> {
    return this.repository.findOne(options);
  }

  async find(options?: any): Promise<SecurityLog[]> {
    return this.repository.find(options);
  }

  create(entityLike: Partial<SecurityLog>): SecurityLog {
    return this.repository.create(entityLike);
  }

  createMany(entityLikes: Partial<SecurityLog>[]): SecurityLog[] {
    return this.repository.create(entityLikes);
  }

  async save(entity: SecurityLog): Promise<SecurityLog> {
    return this.repository.save(entity);
  }

  createQueryBuilder(alias: string) {
    return this.repository.createQueryBuilder(alias);
  }
}
