import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Church } from '../../churches/entities/church.entity';
import { User } from '../../users/entities/user.entity';

export enum TitheType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
}

@Entity('tithe_subscriptions')
export class TitheSubscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'church_id' })
  churchId: string;

  @ManyToOne(() => Church, { eager: false })
  @JoinColumn({ name: 'church_id' })
  church: Church;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'enum', enum: TitheType, default: TitheType.PERCENTAGE })
  type: TitheType;

  /** Percent (e.g. 10 = 10%) or fixed amount in RWF */
  @Column({ type: 'numeric', precision: 10, scale: 2 })
  value: number;

  @Column({ name: 'payer_phone', length: 30 })
  payerPhone: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'retry_count', default: 0 })
  retryCount: number;

  @Column({ name: 'next_charge_date', type: 'date' })
  nextChargeDate: Date;

  @Column({ name: 'last_charged_at', type: 'timestamptz', nullable: true })
  lastChargedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
