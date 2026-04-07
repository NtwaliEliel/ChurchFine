import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser, type AuthUser } from '../common/decorators/current-user.decorator';
import { GivingCategoriesService } from './giving-categories.service';
import { CreateGivingCategoryDto } from './dto/create-giving-category.dto';
import { UpdateGivingCategoryDto } from './dto/update-giving-category.dto';

@Controller({ path: 'giving-categories', version: '1' })
export class GivingCategoriesController {
  constructor(private readonly service: GivingCategoriesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  list(@CurrentUser() user: AuthUser) {
    return this.service.list(user.churchId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateGivingCategoryDto) {
    return this.service.create(user.churchId, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @Patch(':id')
  update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: UpdateGivingCategoryDto) {
    return this.service.update(user.churchId, id, dto);
  }
}

