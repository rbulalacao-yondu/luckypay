import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('gaming_machines')
export class GamingMachine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  location: string;

  @Column()
  type: string;

  @Column()
  manufacturer: string;

  @Column()
  model: string;

  @Column('text', {
    transformer: {
      to: (value: string[]) => value.join(','),
      from: (value: string) => (value ? value.split(',') : []),
    },
  })
  denominations: string[];

  @Column('text', {
    transformer: {
      to: (value: string[]) => value.join(','),
      from: (value: string) => (value ? value.split(',') : []),
    },
  })
  gameTypes: string[];

  @Column('text', {
    transformer: {
      to: (value: string[]) => value.join(','),
      from: (value: string) => (value ? value.split(',') : []),
    },
  })
  payTables: string[];

  @Column('json')
  playerLimits: {
    minBet: number;
    maxBet: number;
  };

  @Column()
  firmwareVersion: string;

  @Column()
  gameVersion: string;
}
