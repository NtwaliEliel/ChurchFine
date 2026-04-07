import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GivingCategory } from './entities/giving-category.entity';
import { GivingCategoriesService } from './giving-categories.service';
import { GivingCategoriesController } from './giving-categories.controller';

@Module({
  imports: [TypeOrmModule.forFeature([GivingCategory])],
  controllers: [GivingCategoriesController],
  providers: [GivingCategoriesService],
  exports: [GivingCategoriesService, TypeOrmModule],
})
export class GivingCategoriesModule {}

