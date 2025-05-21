import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User, UserRole } from '../users/entities/user.entity';
import { CoinIn } from '../admin/entities/coin-in.entity';
import { GamingMachine } from '../admin/entities/gaming-machine.entity';
import * as crypto from 'crypto';

// Common bet multipliers for different game types
const betMultipliers = {
  'Classic Slots': [1, 2, 3, 5],
  'Video Slots': [1, 2, 5, 10],
  Poker: [1, 2, 5, 10],
  Blackjack: [1, 2, 5, 10, 20],
  Roulette: [1, 5, 10, 20, 50],
  Baccarat: [5, 10, 25, 50],
  Keno: [1, 2, 3, 5],
  Bingo: [1, 2, 5],
};

function generateRecentTimestamp(): Date {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  return new Date(
    thirtyDaysAgo.getTime() +
      Math.random() * (now.getTime() - thirtyDaysAgo.getTime()),
  );
}

function generateAmount(gameType: string, denominations: string[]): number {
  const denomination = parseFloat(
    denominations[Math.floor(Math.random() * denominations.length)],
  );
  const multiplier =
    betMultipliers[gameType][
      Math.floor(Math.random() * betMultipliers[gameType].length)
    ];
  return parseFloat((denomination * multiplier).toFixed(2));
}

async function seedCoinIns() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userRepository = app.get<Repository<User>>(getRepositoryToken(User));
  const coinInRepository = app.get<Repository<CoinIn>>(
    getRepositoryToken(CoinIn),
  );
  const machineRepository = app.get<Repository<GamingMachine>>(
    getRepositoryToken(GamingMachine),
  );

  try {
    // Get all players and machines
    const players = await userRepository.find({
      where: { role: UserRole.USER },
    });
    const machines = await machineRepository.find();

    if (players.length === 0 || machines.length === 0) {
      throw new Error(
        'No players or machines found. Run user and machine seeders first.',
      );
    }

    console.log(
      `Found ${players.length} players and ${machines.length} machines.`,
    );

    // Clear existing coin-ins
    await coinInRepository.clear();

    // Generate 1000 coin-in transactions
    const coinIns: Partial<CoinIn>[] = [];
    const machineBalances = new Map<string, number>();

    for (let i = 0; i < 1000; i++) {
      const player = players[Math.floor(Math.random() * players.length)];
      const machine = machines[Math.floor(Math.random() * machines.length)];
      const gameType =
        machine.gameTypes[Math.floor(Math.random() * machine.gameTypes.length)];
      const amount = generateAmount(gameType, machine.denominations);

      // Update machine balance
      const currentBalance = machineBalances.get(machine.id) || 0;
      const newBalance = currentBalance + amount;
      machineBalances.set(machine.id, newBalance);

      coinIns.push({
        id: crypto.randomUUID(),
        userId: player.id,
        machineId: machine.id,
        gameType,
        amount,
        machineBalance: newBalance,
        timestamp: generateRecentTimestamp(),
      });
    }

    // Sort by timestamp
    coinIns.sort(
      (a, b) =>
        (a.timestamp as Date).getTime() - (b.timestamp as Date).getTime(),
    );

    // Save in chunks
    const chunkSize = 100;
    for (let i = 0; i < coinIns.length; i += chunkSize) {
      const chunk = coinIns.slice(i, i + chunkSize);
      await coinInRepository.save(chunk);
      console.log(`Saved ${i + chunk.length} of ${coinIns.length} coin-ins...`);
    }

    console.log('Successfully seeded 1000 coin-in transactions');
  } catch (error) {
    console.error('Error seeding coin-ins:', error);
    throw error;
  } finally {
    await app.close();
  }
}

seedCoinIns().catch((error) => {
  console.error('Failed to seed coin-ins:', error);
  process.exit(1);
});
