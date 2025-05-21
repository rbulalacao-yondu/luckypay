import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { GamingMachine } from '../entities/gaming-machine.entity';

@Injectable()
export class GamingMachineService {
  constructor(
    @InjectRepository(GamingMachine)
    private readonly gamingMachineRepository: Repository<GamingMachine>,
  ) {}

  async findAll(): Promise<GamingMachine[]> {
    return this.gamingMachineRepository.find();
  }

  async findOne(id: string): Promise<GamingMachine> {
    const machine = await this.gamingMachineRepository.findOne({
      where: { id },
    });
    if (!machine) {
      throw new Error(`Gaming machine with id ${id} not found`);
    }
    return machine;
  }

  async search(query: string): Promise<GamingMachine[]> {
    if (!query) {
      return this.findAll();
    }

    // Search across multiple fields
    return this.gamingMachineRepository.find({
      where: [
        { location: Like(`%${query}%`) },
        { type: Like(`%${query}%`) },
        { manufacturer: Like(`%${query}%`) },
        { model: Like(`%${query}%`) },
      ],
    });
  }
}
