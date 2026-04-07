import { PartialType } from '@nestjs/mapped-types';
import { CreateGivingCategoryDto } from './create-giving-category.dto';

export class UpdateGivingCategoryDto extends PartialType(CreateGivingCategoryDto) {}

