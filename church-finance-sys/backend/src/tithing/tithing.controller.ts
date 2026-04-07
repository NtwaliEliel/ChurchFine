import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, type AuthUser } from '../common/decorators/current-user.decorator';
import { UpsertTitheSubscriptionDto } from './dto/upsert-tithe-subscription.dto';
import { TithingService } from './tithing.service';

@Controller({ path: 'tithing', version: '1' })
export class TithingController {
  constructor(private readonly service: TithingService) {}

  @UseGuards(JwtAuthGuard)
  @Get('subscription')
  getMine(@CurrentUser() user: AuthUser) {
    return this.service.getMySubscription(user.churchId, user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post('subscription')
  upsertMine(@CurrentUser() user: AuthUser, @Body() dto: UpsertTitheSubscriptionDto) {
    return this.service.upsertMySubscription(user.churchId, user.sub, dto);
  }
}

