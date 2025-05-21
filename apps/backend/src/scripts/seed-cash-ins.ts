import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User, UserRole } from '../users/entities/user.entity';
import { CashIn, CashInChannel } from '../admin/entities/cash-in.entity';

// Common GCash transaction amounts
const commonAmounts = [
  100, 200, 300, 500, 1000, 2000, 3000, 5000, 10000, 15000, 20000,
];

// For generating realistic timestamps
function generateRecentTimestamp(): Date {
  // Generate timestamps within the last 30 days
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  return new Date(
    thirtyDaysAgo.getTime() +
      Math.random() * (now.getTime() - thirtyDaysAgo.getTime()),
  );
}

// Generate a realistic GCash reference number
function generateGCashReference(): string {
  // Format: 0000YYYYMMDDXXXXX where XXXXX is a random 5-digit number
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, '0');
  return `0000${year}${month}${day}${random}`;
}

// Generate a realistic cash-in amount
function generateAmount(): number {
  // 80% chance of using common amounts
  if (Math.random() < 0.8) {
    return commonAmounts[Math.floor(Math.random() * commonAmounts.length)];
  }

  // 20% chance of custom amount
  // Generate custom amounts between 100 and 50000, rounded to nearest 100
  return Math.round(Math.floor(Math.random() * 50000 + 100) / 100) * 100;
}

async function seedCashIns() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userRepository = app.get<Repository<User>>(getRepositoryToken(User));
  const cashInRepository = app.get<Repository<CashIn>>(
    getRepositoryToken(CashIn),
  );

  try {
    // Get all players (users with role USER)
    const players = await userRepository.find({
      where: { role: UserRole.USER },
    });

    if (players.length === 0) {
      console.error('No players found in database. Run seed-players.ts first.');
      return;
    }

    console.log(
      `Found ${players.length} players. Generating cash-in transactions...`,
    );

    // Clear existing cash-ins
    await cashInRepository.clear();

    // Reset all player balances to 0
    await Promise.all(
      players.map((player) =>
        userRepository.update(player.id, { walletBalance: 0 }),
      ),
    );

    // Generate 1000 cash-in transactions
    const cashIns: Partial<CashIn>[] = [];
    const playerBalances = new Map<number, number>();

    for (let i = 0; i < 1000; i++) {
      // Select a random player
      const player = players[Math.floor(Math.random() * players.length)];

      // Generate transaction amount
      const amount = generateAmount();

      // Calculate new balance
      const currentBalance = playerBalances.get(player.id) || 0;
      const newBalance = currentBalance + amount;
      playerBalances.set(player.id, newBalance);

      const cashIn: Partial<CashIn> = {
        userId: player.id,
        amount,
        endingBalance: newBalance,
        channel: CashInChannel.GCASH,
        referenceId: generateGCashReference(),
        timestamp: generateRecentTimestamp(),
      };

      cashIns.push(cashIn);
    }

    // Sort cash-ins by timestamp
    cashIns.sort(
      (a, b) =>
        (a.timestamp as Date).getTime() - (b.timestamp as Date).getTime(),
    );

    // Save all cash-ins in chunks to avoid memory issues
    const chunkSize = 100;
    for (let i = 0; i < cashIns.length; i += chunkSize) {
      const chunk = cashIns.slice(i, i + chunkSize);
      await cashInRepository.save(chunk);
      console.log(`Saved ${i + chunk.length} of ${cashIns.length} cash-ins...`);
    }

    // Update all player balances
    await Promise.all(
      Array.from(playerBalances.entries()).map(([playerId, balance]) =>
        userRepository.update(playerId, { walletBalance: balance }),
      ),
    );

    console.log('Successfully seeded 1000 cash-in transactions');
  } catch (error) {
    console.error('Error seeding cash-ins:', error);
  } finally {
    await app.close();
  }
}

seedCashIns().catch((error) => {
  console.error('Failed to seed cash-ins:', error);
  process.exit(1);
});
