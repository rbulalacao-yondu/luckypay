import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository {
  private readonly repository: Repository<User>;

  constructor(private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(User);
  }

  async findOne(options: any): Promise<User | null> {
    return this.repository.findOne(options);
  }

  async find(options?: any): Promise<User[]> {
    return this.repository.find(options);
  }

  create(entityLike: Partial<User>): User {
    return this.repository.create(entityLike);
  }

  createMany(entityLikes: Partial<User>[]): User[] {
    return this.repository.create(entityLikes);
  }

  async update(id: number, updateData: Partial<User>): Promise<void> {
    await this.repository.update(id, updateData);
  }

  async save(entity: User): Promise<User> {
    return this.repository.save(entity);
  }
}
