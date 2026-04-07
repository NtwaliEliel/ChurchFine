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
import { GivingCategory } from '../../giving-categories/entities/giving-category.entity';

export enum TransactionStatus {
  PENDING = 'pending',
  SUCCESSFUL = 'successful',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

@Entity('transactions')
export class Transaction {
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

  @Column({ name: 'category_id', nullable: true })
  categoryId: string;

  @ManyToOne(() => GivingCategory, { eager: false, nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: GivingCategory;

  @Column({ type: 'numeric', precision: 14, scale: 2 })
  amount: number;

  @Column({ length: 10, default: 'RWF' })
  currency: string;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @Column({ name: 'momo_reference', length: 100, nullable: true })
  momoReference: string;

  @Column({ name: 'idempotency_key', unique: true })
  idempotencyKey: string;

  @Column({ name: 'payer_phone', length: 30 })
  payerPhone: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({ name: 'failure_reason', type: 'text', nullable: true })
  failureReason: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
  // NO deletedAt — financial records are immutable
}
