import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GivingCategory } from './entities/giving-category.entity';
import { CreateGivingCategoryDto } from './dto/create-giving-category.dto';
import { UpdateGivingCategoryDto } from './dto/update-giving-category.dto';

@Injectable()
export class GivingCategoriesService {
  constructor(
    @InjectRepository(GivingCategory)
    private readonly repo: Repository<GivingCategory>,
  ) {}

  list(churchId: string) {
    return this.repo.find({ where: { churchId }, order: { createdAt: 'DESC' } });
  }

  async create(churchId: string, dto: CreateGivingCategoryDto) {
    const entity = this.repo.create({ ...dto, churchId });
    return await this.repo.save(entity);
  }

  async update(churchId: string, id: string, dto: UpdateGivingCategoryDto) {
    const existing = await this.repo.findOne({ where: { id, churchId } });
    if (!existing) throw new NotFoundException('Category not found');
    Object.assign(existing, dto);
    return await this.repo.save(existing);
  }
}

