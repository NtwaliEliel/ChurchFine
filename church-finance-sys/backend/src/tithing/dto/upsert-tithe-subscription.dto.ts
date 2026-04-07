import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { TitheType } from '../entities/tithe-subscription.entity';

export class UpsertTitheSubscriptionDto {
  @IsEnum(TitheType)
  type: TitheType;

  @IsNumber()
  @Min(1)
  value: number;

  @IsString()
  @IsNotEmpty()
  payerPhone: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

