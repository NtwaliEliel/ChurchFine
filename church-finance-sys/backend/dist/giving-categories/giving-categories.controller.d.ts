import { type AuthUser } from '../common/decorators/current-user.decorator';
import { GivingCategoriesService } from './giving-categories.service';
import { CreateGivingCategoryDto } from './dto/create-giving-category.dto';
import { UpdateGivingCategoryDto } from './dto/update-giving-category.dto';
export declare class GivingCategoriesController {
    private readonly service;
    constructor(service: GivingCategoriesService);
    list(user: AuthUser): Promise<import("./entities/giving-category.entity").GivingCategory[]>;
    create(user: AuthUser, dto: CreateGivingCategoryDto): Promise<import("./entities/giving-category.entity").GivingCategory>;
    update(user: AuthUser, id: string, dto: UpdateGivingCategoryDto): Promise<import("./entities/giving-category.entity").GivingCategory>;
}
