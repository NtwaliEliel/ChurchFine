import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateGivingCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

