import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CashIn } from '../entities/cash-in.entity';
import { CoinIn } from '../entities/coin-in.entity';
import { startOfDay, endOfDay, subDays } from 'date-fns';

@Injectable()
export class FinancialStatsService {
  constructor(
    @InjectRepository(CashIn)
    private readonly cashInRepository: Repository<CashIn>,
    @InjectRepository(CoinIn)
    private readonly coinInRepository: Repository<CoinIn>,
  ) {}

  async getFinancialStats() {
    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);

    // Initialize hourly transaction counts
    const hourlyTransactions = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      count: 0,
      amount: 0,
    }));

    // Get today's transactions
    const [todaysCashIns, todaysCoinIns] = await Promise.all([
      this.cashInRepository.find({
        where: {
          timestamp: Between(startOfToday, endOfToday),
        },
      }),
      this.coinInRepository.find({
        where: {
          timestamp: Between(startOfToday, endOfToday),
        },
      }),
    ]);

    // Calculate total transactions and revenue for today
    const totalTransactionsToday = todaysCashIns.length + todaysCoinIns.length;
    const totalRevenueToday = [
      ...todaysCashIns.map((c) => c.amount),
      ...todaysCoinIns.map((c) => c.amount),
    ].reduce((acc, curr) => acc + Number(curr), 0);

    // Calculate average transaction value
    const avgTransactionValue =
      totalTransactionsToday > 0
        ? totalRevenueToday / totalTransactionsToday
        : 0;

    // Get daily revenue for the past 7 days
    const dailyRevenue = await Promise.all(
      Array.from({ length: 7 }, async (_, i) => {
        const date = subDays(today, 6 - i);
        const start = startOfDay(date);
        const end = endOfDay(date);

        const [cashIns, coinIns] = await Promise.all([
          this.cashInRepository.find({
            where: {
              timestamp: Between(start, end),
            },
          }),
          this.coinInRepository.find({
            where: {
              timestamp: Between(start, end),
            },
          }),
        ]);

        const cashInsTotal = cashIns
          .map((c) => Number(c.amount))
          .reduce((acc, curr) => acc + curr, 0);

        const coinInsTotal = coinIns
          .map((c) => Number(c.amount))
          .reduce((acc, curr) => acc + curr, 0);

        return {
          date: date.toLocaleDateString(),
          cashIns: cashInsTotal,
          coinIns: coinInsTotal,
          total: cashInsTotal + coinInsTotal,
        };
      }),
    );

    // Calculate revenue growth (comparing today with yesterday)
    const yesterdayTotal = dailyRevenue[5].total;
    const revenueGrowth =
      yesterdayTotal > 0
        ? ((totalRevenueToday - yesterdayTotal) / yesterdayTotal) * 100
        : 0;

    // Calculate hourly transactions and payment channel distribution
    const cashInsTotal = todaysCashIns.reduce(
      (acc, curr) => acc + Number(curr.amount),
      0,
    );
    const coinInsTotal = todaysCoinIns.reduce(
      (acc, curr) => acc + Number(curr.amount),
      0,
    );

    // Process transactions by hour
    [...todaysCashIns, ...todaysCoinIns].forEach((transaction) => {
      const hour = new Date(transaction.timestamp).getHours();
      hourlyTransactions[hour].count++;
      hourlyTransactions[hour].amount += Number(transaction.amount);
    });

    // Calculate payment channel distribution
    const paymentChannels = [
      {
        channel: 'GCash',
        amount: cashInsTotal,
        percentage: (cashInsTotal / (cashInsTotal + coinInsTotal || 1)) * 100,
      },
      {
        channel: 'Coin-in',
        amount: coinInsTotal,
        percentage: (coinInsTotal / (cashInsTotal + coinInsTotal || 1)) * 100,
      },
    ];

    return {
      totalTransactionsToday,
      avgTransactionValue,
      totalRevenueToday,
      revenueGrowth,
      dailyRevenue,
      hourlyTransactions,
      paymentChannels,
    };
  }
}
