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

@Entity('giving_categories')
export class GivingCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'church_id' })
  churchId: string;

  @ManyToOne(() => Church, { eager: false })
  @JoinColumn({ name: 'church_id' })
  church: Church;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
