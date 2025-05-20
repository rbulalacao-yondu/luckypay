import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

export enum SecurityLogType {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  OTP_REQUEST = 'OTP_REQUEST',
  OTP_VERIFICATION = 'OTP_VERIFICATION',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  ROLE_CHANGE = 'ROLE_CHANGE',
  ACCOUNT_LOCK = 'ACCOUNT_LOCK',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
}

@Entity('security_logs')
export class SecurityLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ nullable: true })
  ipAddress: string;

  @Column()
  action: string;

  @Column({
    type: 'enum',
    enum: SecurityLogType,
  })
  type: SecurityLogType;

  @Column('json', { nullable: true })
  metadata: Record<string, any>;

  @Column({ nullable: true })
  userAgent: string;

  @CreateDateColumn()
  createdAt: Date;
}
