import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum CashInChannel {
  GCASH = 'gcash',
}

@Entity('cash_ins')
export class CashIn {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column('decimal', { precision: 10, scale: 2 })
  endingBalance: number;

  @Column({ type: 'enum', enum: CashInChannel, default: CashInChannel.GCASH })
  channel: CashInChannel;

  @Column({ type: 'varchar', length: 255, nullable: true })
  referenceId: string;

  @CreateDateColumn()
  timestamp: Date;
}
