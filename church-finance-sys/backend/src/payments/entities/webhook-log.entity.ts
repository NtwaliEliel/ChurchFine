import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('webhook_logs')
export class WebhookLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, default: 'mtn_momo' })
  provider: string;

  @Column({ length: 100, nullable: true })
  reference: string;

  @Column({ type: 'jsonb' })
  payload: Record<string, any>;

  @Column({ length: 50, nullable: true })
  status: string;

  @Column({ default: false })
  processed: boolean;

  @CreateDateColumn({ name: 'received_at' })
  receivedAt: Date;
}
