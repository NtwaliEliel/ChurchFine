import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsModule } from '../payments/payments.module';
import { TitheSubscription } from './entities/tithe-subscription.entity';
import { TithingService } from './tithing.service';
import { TithingController } from './tithing.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TitheSubscription]), PaymentsModule],
  controllers: [TithingController],
  providers: [TithingService],
  exports: [TithingService],
})
export class TithingModule {}

