import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { GamingMachine } from '../entities/gaming-machine.entity';
import { CoinIn } from '../entities/coin-in.entity';
import { startOfDay, endOfDay, subDays } from 'date-fns';

@Injectable()
export class MachineAnalyticsService {
  constructor(
    @InjectRepository(GamingMachine)
    private readonly gamingMachineRepository: Repository<GamingMachine>,
    @InjectRepository(CoinIn)
    private readonly coinInRepository: Repository<CoinIn>,
  ) {}

  async getMachinePerformance(days: number = 7) {
    const startDate = startOfDay(subDays(new Date(), days - 1));
    const endDate = endOfDay(new Date());

    // Get all coin-ins for the period
    const coinIns = await this.coinInRepository.find({
      where: {
        timestamp: Between(startDate, endDate),
      },
      relations: ['machine'],
    });

    // Get all machines
    const machines = await this.gamingMachineRepository.find();

    // Calculate machine performance metrics
    const machineMetrics = machines.map((machine) => {
      const machineCoinIns = coinIns.filter(
        (ci) => ci.machineId === machine.id,
      );
      const totalVolume = machineCoinIns.reduce(
        (sum, ci) => sum + Number(ci.amount),
        0,
      );
      const utilization = machineCoinIns.length / (days * 24); // Average transactions per hour
      const gameTypeCounts = machineCoinIns.reduce(
        (acc, ci) => {
          acc[ci.gameType] = (acc[ci.gameType] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

      return {
        id: machine.id,
        location: machine.location,
        type: machine.type,
        manufacturer: machine.manufacturer,
        model: machine.model,
        coinInVolume: totalVolume,
        utilizationRate: utilization,
        currentBalance:
          machineCoinIns[machineCoinIns.length - 1]?.machineBalance || 0,
        popularity: machineCoinIns.length,
        gameTypes: gameTypeCounts,
      };
    });

    // Sort machines by volume
    const topMachines = [...machineMetrics].sort(
      (a, b) => b.coinInVolume - a.coinInVolume,
    );

    // Calculate location analytics
    const locationAnalytics = machineMetrics.reduce(
      (acc, machine) => {
        if (!acc[machine.location]) {
          acc[machine.location] = {
            totalVolume: 0,
            machineCount: 0,
            avgUtilization: 0,
            machines: [],
          };
        }

        acc[machine.location].totalVolume += machine.coinInVolume;
        acc[machine.location].machineCount += 1;
        acc[machine.location].avgUtilization += machine.utilizationRate;
        acc[machine.location].machines.push(machine.id);

        return acc;
      },
      {} as Record<
        string,
        {
          totalVolume: number;
          machineCount: number;
          avgUtilization: number;
          machines: string[];
        }
      >,
    );

    // Calculate final metrics for each location
    Object.keys(locationAnalytics).forEach((location) => {
      locationAnalytics[location].avgUtilization /=
        locationAnalytics[location].machineCount;
    });

    // Aggregate game type popularity across all machines
    const gameTypePopularity = machineMetrics.reduce(
      (acc, machine) => {
        Object.entries(machine.gameTypes).forEach(([gameType, count]) => {
          acc[gameType] = (acc[gameType] || 0) + count;
        });
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      topMachines: topMachines.slice(0, 10),
      machineMetrics,
      locationAnalytics,
      gameTypePopularity: Object.entries(gameTypePopularity)
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count),
    };
  }
}
