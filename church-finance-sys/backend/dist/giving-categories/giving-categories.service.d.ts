import { Repository } from 'typeorm';
import { GivingCategory } from './entities/giving-category.entity';
import { CreateGivingCategoryDto } from './dto/create-giving-category.dto';
import { UpdateGivingCategoryDto } from './dto/update-giving-category.dto';
export declare class GivingCategoriesService {
    private readonly repo;
    constructor(repo: Repository<GivingCategory>);
    list(churchId: string): Promise<GivingCategory[]>;
    create(churchId: string, dto: CreateGivingCategoryDto): Promise<GivingCategory>;
    update(churchId: string, id: string, dto: UpdateGivingCategoryDto): Promise<GivingCategory>;
}
