import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Church } from '../../churches/entities/church.entity';

export enum UserRole {
  MEMBER = 'member',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'church_id' })
  churchId: string;

  @ManyToOne(() => Church, { eager: false })
  @JoinColumn({ name: 'church_id' })
  church: Church;

  @Column({ length: 255, nullable: true })
  email: string;

  @Column({ length: 30 })
  phone: string;

  @Column({ name: 'first_name', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', length: 100 })
  lastName: string;

  @Exclude()
  @Column({ name: 'password_hash', length: 255 })
  passwordHash: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.MEMBER })
  role: UserRole;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
