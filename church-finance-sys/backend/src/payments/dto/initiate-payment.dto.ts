import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class InitiatePaymentDto {
  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsNumber()
  @Min(1)
  amount: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsString()
  @IsNotEmpty()
  payerPhone: string;

  @IsOptional()
  @IsString()
  description?: string;
}

