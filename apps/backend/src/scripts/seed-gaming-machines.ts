import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { Repository } from 'typeorm';
import { GamingMachine } from '../admin/entities/gaming-machine.entity';
import { MachineStatus } from '../admin/entities/machine-status.enum';
import { getRepositoryToken } from '@nestjs/typeorm';

const manufacturers = [
  'IGT',
  'Aristocrat',
  'Scientific Games',
  'Novomatic',
  'Konami Gaming',
  'Ainsworth',
  'Aruze Gaming',
];

const machineTypes = [
  'Slot Machine',
  'Video Poker',
  'Electronic Table Game',
  'Multi-Game',
  'Progressive Slot',
];

const gameTypes = [
  'Classic Slots',
  'Video Slots',
  'Poker',
  'Blackjack',
  'Roulette',
  'Baccarat',
  'Keno',
  'Bingo',
];

const locations = [
  'Main Floor North',
  'Main Floor South',
  'High Limit Room',
  'VIP Area',
  'Slots Paradise',
  'Table Games Section',
  'Progressive Zone',
];

const modelPrefixes = ['G', 'S', 'C', 'P', 'V'];
const modelNumbers = [
  '1000',
  '2000',
  '3000',
  '4000',
  '5000',
  'X',
  'Pro',
  'Elite',
];

function generateRandomModel(): string {
  const prefix =
    modelPrefixes[Math.floor(Math.random() * modelPrefixes.length)];
  const number = modelNumbers[Math.floor(Math.random() * modelNumbers.length)];
  return `${prefix}-${number}`;
}

function getRandomElements<T>(array: T[], min: number, max: number): T[] {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateRandomDenominations(): string[] {
  const possibleDenominations = [
    '0.01',
    '0.05',
    '0.25',
    '1.00',
    '5.00',
    '10.00',
    '25.00',
    '100.00',
  ];
  return getRandomElements(possibleDenominations, 2, 4);
}

function generateRandomPayTables(): string[] {
  const basePays = ['97.5%', '96.3%', '94.8%', '93.2%', '95.5%'];
  return getRandomElements(basePays, 1, 2);
}

function generateVersion(): string {
  const major = Math.floor(Math.random() * 5) + 1;
  const minor = Math.floor(Math.random() * 10);
  const patch = Math.floor(Math.random() * 100);
  return `${major}.${minor}.${patch}`;
}

async function seedGamingMachines() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const gamingMachineRepository = app.get<Repository<GamingMachine>>(
    getRepositoryToken(GamingMachine),
  );

  const machines: Partial<GamingMachine>[] = Array.from({ length: 50 }, () => ({
    location: locations[Math.floor(Math.random() * locations.length)],
    type: machineTypes[Math.floor(Math.random() * machineTypes.length)],
    manufacturer:
      manufacturers[Math.floor(Math.random() * manufacturers.length)],
    model: generateRandomModel(),
    denominations: generateRandomDenominations(),
    gameTypes: getRandomElements(gameTypes, 1, 3),
    payTables: generateRandomPayTables(),
    playerLimits: {
      minBet: parseFloat(generateRandomDenominations()[0]),
      maxBet: Math.floor(Math.random() * 500) + 100,
    },
    firmwareVersion: generateVersion(),
    gameVersion: generateVersion(),
    status:
      Object.values(MachineStatus)[
        Math.floor(Math.random() * Object.values(MachineStatus).length)
      ],
  }));

  try {
    // Get existing machines
    const existingMachines = await gamingMachineRepository.find();
    // Update existing machines
    for (let i = 0; i < existingMachines.length; i++) {
      const machine = machines[i];
      if (machine) {
        await gamingMachineRepository.update(existingMachines[i].id, machine);
      }
    }

    // Create new machines if needed
    if (existingMachines.length < machines.length) {
      const newMachines = machines.slice(existingMachines.length);
      for (const machine of newMachines) {
        await gamingMachineRepository.save(machine);
      }
    }

    console.log(
      `Successfully seeded/updated ${machines.length} gaming machines`,
    );
  } catch (error) {
    console.error('Error seeding gaming machines:', error);
  } finally {
    await app.close();
  }
}

seedGamingMachines().catch((error) => {
  console.error('Failed to seed gaming machines:', error);
  process.exit(1);
});
