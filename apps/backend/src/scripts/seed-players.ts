import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { Repository } from 'typeorm';
import {
  User,
  UserRole,
  UserStatus,
  LoyaltyTier,
} from '../users/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

const filipinoFirstNames = [
  'Juan',
  'Maria',
  'Jose',
  'Antonio',
  'Miguel',
  'Ricardo',
  'Eduardo',
  'Isabela',
  'Rosario',
  'Fernando',
  'Carmen',
  'Gloria',
  'Francisco',
  'Mariano',
  'Javier',
  'Luis',
  'Manuel',
  'Rodrigo',
  'Angelo',
  'Regina',
  'Marco',
  'Andrea',
  'Paolo',
  'Bianca',
  'Gabriel',
  'Sofia',
  'Diego',
  'Nina',
  'Carlos',
  'Teresa',
];

const filipinoLastNames = [
  'Santos',
  'Reyes',
  'Cruz',
  'Garcia',
  'Torres',
  'Lopez',
  'Mendoza',
  'Ramos',
  'Flores',
  'De Leon',
  'Villanueva',
  'Perez',
  'Ramirez',
  'Castillo',
  'Rivera',
  'Aquino',
  'Gonzales',
  'Diaz',
  'Martinez',
  'Rodriguez',
  'Dela Cruz',
  'Domingo',
  'Tan',
  'Lim',
  'Go',
];

const chineseFirstNames = [
  'Wei',
  'Ming',
  'Hui',
  'Xiao',
  'Li',
  'Jing',
  'Yong',
  'Chen',
  'Ying',
  'Hong',
  'Jun',
  'Lin',
  'Yu',
  'Zhong',
  'Feng',
  'Yang',
  'Qiang',
  'Yan',
  'Hua',
  'Xin',
  'Jin',
  'Mei',
  'Ling',
  'Hao',
  'Gang',
  'Yi',
  'Cheng',
  'Wu',
  'Ping',
  'Guang',
];

const chineseLastNames = [
  'Wang',
  'Li',
  'Zhang',
  'Liu',
  'Chen',
  'Yang',
  'Huang',
  'Zhou',
  'Wu',
  'Xu',
  'Sun',
  'Ma',
  'Zhu',
  'Hu',
  'Guo',
  'He',
  'Lin',
  'Gao',
  'Luo',
  'Zheng',
  'Liang',
  'Xie',
  'Tang',
  'Xu',
  'Ng',
  'Tan',
  'Yu',
  'Cai',
  'Tian',
  'Fan',
];

const americanFirstNames = [
  'James',
  'John',
  'Robert',
  'Michael',
  'William',
  'David',
  'Richard',
  'Mary',
  'Patricia',
  'Jennifer',
  'Linda',
  'Elizabeth',
  'Sarah',
  'Christopher',
  'Daniel',
  'Paul',
  'Mark',
  'Donald',
  'George',
  'Kenneth',
  'Steven',
  'Edward',
  'Brian',
  'Ronald',
  'Anthony',
  'Kevin',
  'Jason',
  'Matthew',
  'Gary',
  'Timothy',
];

const americanLastNames = [
  'Smith',
  'Johnson',
  'Williams',
  'Brown',
  'Jones',
  'Miller',
  'Davis',
  'Wilson',
  'Anderson',
  'Taylor',
  'Thomas',
  'Moore',
  'Jackson',
  'White',
  'Harris',
  'Clark',
  'Lewis',
  'Robinson',
  'Walker',
  'Young',
  'Allen',
  'King',
  'Wright',
  'Scott',
  'Green',
];

function generateRandomName(nameType: 'filipino' | 'chinese' | 'american'): {
  firstName: string;
  lastName: string;
} {
  let firstNames: string[];
  let lastNames: string[];

  switch (nameType) {
    case 'filipino':
      firstNames = filipinoFirstNames;
      lastNames = filipinoLastNames;
      break;
    case 'chinese':
      firstNames = chineseFirstNames;
      lastNames = chineseLastNames;
      break;
    case 'american':
      firstNames = americanFirstNames;
      lastNames = americanLastNames;
      break;
  }

  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

  return { firstName, lastName };
}

function generateRandomPhoneNumber(): string {
  const prefixes = [
    '0917',
    '0918',
    '0919',
    '0920',
    '0921',
    '0928',
    '0929',
    '0930',
    '0938',
    '0939',
    '0946',
    '0947',
    '0949',
    '0951',
    '0961',
    '0998',
    '0999',
  ];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const number = Math.floor(Math.random() * 9000000) + 1000000; // 7 digits
  return `${prefix}${number}`;
}

function generateRandomEmail(firstName: string, lastName: string): string {
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  const randomNum = Math.floor(Math.random() * 1000);
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomNum}@${domain}`.replace(
    /\s/g,
    '',
  );
}

function generateRandomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}

function generateRandomAddress(): string {
  const streetNumbers = Array.from({ length: 100 }, (_, i) => i + 1);
  const streetNames = [
    'Rizal Street',
    'Mabini Avenue',
    'Quezon Boulevard',
    'Bonifacio Road',
    'McKinley Road',
    'Ayala Avenue',
    'Roxas Boulevard',
    'Taft Avenue',
    'EDSA',
    'C5 Road',
    'Shaw Boulevard',
    'Ortigas Avenue',
  ];
  const cities = [
    'Makati',
    'Taguig',
    'Pasig',
    'Mandaluyong',
    'Manila',
    'Quezon City',
    'San Juan',
    'Paranaque',
    'Pasay',
    'Marikina',
  ];

  const number =
    streetNumbers[Math.floor(Math.random() * streetNumbers.length)];
  const street = streetNames[Math.floor(Math.random() * streetNames.length)];
  const city = cities[Math.floor(Math.random() * cities.length)];

  return `${number} ${street}, ${city}, Metro Manila`;
}

function generateRandomWalletBalance(): number {
  // Generate a random balance between 0 and 50,000
  return Math.floor(Math.random() * 50000);
}

function generateRandomLoyaltyPoints(): number {
  // Generate random points between 0 and 10000
  return Math.floor(Math.random() * 10000);
}

function determineLoyaltyTier(points: number): LoyaltyTier {
  if (points >= 7500) return LoyaltyTier.PLATINUM;
  if (points >= 5000) return LoyaltyTier.GOLD;
  if (points >= 2500) return LoyaltyTier.SILVER;
  return LoyaltyTier.BRONZE;
}

async function seedPlayers() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userRepository = app.get<Repository<User>>(getRepositoryToken(User));

  const nameTypes: Array<'filipino' | 'chinese' | 'american'> = [
    'filipino',
    'chinese',
    'american',
  ];
  const players: Partial<User>[] = [];
  const now = new Date();
  const oneYearAgo = new Date(
    now.getFullYear() - 1,
    now.getMonth(),
    now.getDate(),
  );

  // Create 200 players with the following distribution:
  // 50% Filipino names
  // 30% Chinese names
  // 20% American names
  const distributions = {
    filipino: 100,
    chinese: 60,
    american: 40,
  };

  for (const nameType of nameTypes) {
    const count = distributions[nameType];
    for (let i = 0; i < count; i++) {
      const { firstName, lastName } = generateRandomName(nameType);
      const loyaltyPoints = generateRandomLoyaltyPoints();
      const lastLoginAt =
        Math.random() > 0.3 ? generateRandomDate(oneYearAgo, now) : undefined;

      const player: Partial<User> = {
        firstName,
        lastName,
        email: generateRandomEmail(firstName, lastName),
        mobileNumber: generateRandomPhoneNumber(),
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
        walletBalance: generateRandomWalletBalance(),
        loyaltyPoints,
        loyaltyTier: determineLoyaltyTier(loyaltyPoints),
        dateOfBirth: generateRandomDate(
          new Date(1970, 0, 1),
          new Date(2000, 11, 31),
        ),
        address: generateRandomAddress(),
        lastLoginAt,
        isMobileVerified: Math.random() > 0.1, // 90% verified
        isEmailVerified: Math.random() > 0.2, // 80% verified
      };

      players.push(player);
    }
  }

  try {
    // Clear existing users with role USER
    await userRepository.delete({ role: UserRole.USER });

    // Save all players
    for (const player of players) {
      await userRepository.save(player);
    }

    console.log('Successfully seeded 200 players');
  } catch (error) {
    console.error('Error seeding players:', error);
  } finally {
    await app.close();
  }
}

seedPlayers().catch((error) => {
  console.error('Failed to seed players:', error);
  process.exit(1);
});
