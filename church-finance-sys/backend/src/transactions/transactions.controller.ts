import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, type AuthUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { TransactionsService } from './transactions.service';

@Controller({ path: 'transactions', version: '1' })
export class TransactionsController {
  constructor(private readonly service: TransactionsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  listMine(@CurrentUser() user: AuthUser, @Query('limit') limit?: string) {
    return this.service.listMyTransactions(user.churchId, user.sub, limit ? Number(limit) : undefined);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.service.getOne(user.churchId, id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @Get('/admin/church')
  listChurch(@CurrentUser() user: AuthUser, @Query('limit') limit?: string) {
    return this.service.listChurchTransactions(user.churchId, limit ? Number(limit) : undefined);
  }
}

