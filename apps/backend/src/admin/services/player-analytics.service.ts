import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { CoinIn } from '../entities/coin-in.entity';
import { startOfDay, endOfDay, subDays } from 'date-fns';
import { UserRole } from '../../users/entities/user.entity';

@Injectable()
export class PlayerAnalyticsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(CoinIn)
    private readonly coinInRepository: Repository<CoinIn>,
  ) {}

  async getPlayerAnalytics(days: number = 7) {
    const startDate = startOfDay(subDays(new Date(), days - 1));
    const endDate = endOfDay(new Date());

    // Get all players
    const players = await this.userRepository.find({
      where: { role: UserRole.USER },
    });

    // Get coin-ins for the period
    const coinIns = await this.coinInRepository.find({
      where: {
        timestamp: Between(startDate, endDate),
      },
      relations: ['user'],
    });

    // Calculate loyalty tier distribution
    const loyaltyDistribution = players.reduce(
      (acc, player) => {
        const existing = acc.find((item) => item.tier === player.loyaltyTier);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ tier: player.loyaltyTier, count: 1 });
        }
        return acc;
      },
      [] as { tier: string; count: number }[],
    );

    // Calculate active players by day
    const activePlayers = [...Array(days)]
      .map((_, index) => {
        const dayStart = startOfDay(subDays(new Date(), index));
        const dayEnd = endOfDay(subDays(new Date(), index));
        const count = new Set(
          coinIns
            .filter((ci) => ci.timestamp >= dayStart && ci.timestamp <= dayEnd)
            .map((ci) => ci.userId),
        ).size;
        return {
          date: dayStart.toISOString().split('T')[0],
          count,
        };
      })
      .reverse();

    // Calculate new vs returning players
    const playerFirstPlays = coinIns.reduce(
      (acc, coinIn) => {
        if (!acc[coinIn.userId] || coinIn.timestamp < acc[coinIn.userId]) {
          acc[coinIn.userId] = coinIn.timestamp;
        }
        return acc;
      },
      {} as Record<number, Date>,
    );

    const newPlayers = Object.values(playerFirstPlays).filter(
      (date) => date >= startDate && date <= endDate,
    ).length;

    const playerSegments = [
      { type: 'new', count: newPlayers },
      {
        type: 'returning',
        count: players.length - newPlayers,
      },
    ];

    // Calculate top players by volume
    const playerVolumes = coinIns.reduce(
      (acc, coinIn) => {
        acc[coinIn.userId] = (acc[coinIn.userId] || 0) + Number(coinIn.amount);
        return acc;
      },
      {} as Record<number, number>,
    );

    const topPlayers = Object.entries(playerVolumes)
      .map(([userId, volume]) => {
        const player = players.find((p) => p.id === parseInt(userId));
        return {
          id: parseInt(userId),
          name: player
            ? `${player.firstName} ${player.lastName}`.trim()
            : 'Unknown',
          volume,
          loyaltyTier: player?.loyaltyTier || 'Unknown',
        };
      })
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 10);

    // Calculate bet size distribution
    const betRanges = [
      { min: 0, max: 100, label: '₱0-100' },
      { min: 101, max: 500, label: '₱101-500' },
      { min: 501, max: 1000, label: '₱501-1000' },
      { min: 1001, max: 5000, label: '₱1001-5000' },
      { min: 5001, max: Infinity, label: '₱5000+' },
    ];

    const betSizes = betRanges.map((range) => ({
      range: range.label,
      count: coinIns.filter(
        (ci) =>
          Number(ci.amount) >= range.min && Number(ci.amount) <= range.max,
      ).length,
    }));

    // Calculate game type preferences
    const gamePreferences = coinIns.reduce(
      (acc, coinIn) => {
        const gameType = coinIn.gameType || 'unknown';
        if (!acc[gameType]) {
          acc[gameType] = 0;
        }
        acc[gameType]++;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Calculate hourly activity patterns
    const timeOfDayActivity = [...Array(24)].map((_, hour) => {
      const hourlyPlays = coinIns.filter(
        (ci) => new Date(ci.timestamp).getHours() === hour,
      );
      return {
        hour,
        players: new Set(hourlyPlays.map((play) => play.userId)).size,
        volume: hourlyPlays.reduce((sum, play) => sum + Number(play.amount), 0),
      };
    });

    // Calculate loyalty points data
    const loyaltyPointsData = loyaltyDistribution.map((tier) => {
      try {
        const tierPlayers = players.filter((p) => p.loyaltyTier === tier.tier);
        const totalPoints = tierPlayers.reduce(
          (sum, p) => sum + (p.loyaltyPoints || 0),
          0,
        );
        return {
          tier: tier.tier,
          averagePoints: tierPlayers.length
            ? Math.round(totalPoints / tierPlayers.length)
            : 0,
          totalPoints,
        };
      } catch (error) {
        console.error(
          `Error calculating loyalty points for tier ${tier.tier}:`,
          error,
        );
        return {
          tier: tier.tier,
          averagePoints: 0,
          totalPoints: 0,
        };
      }
    });

    return {
      loyaltyDistribution,
      activePlayers,
      playerSegments,
      topPlayers,
      betSizes,
      gamePreferences: Object.entries(gamePreferences).map(([type, count]) => ({
        type,
        count,
      })),
      timeOfDayActivity,
      loyaltyPointsData,
    };
  }
}
