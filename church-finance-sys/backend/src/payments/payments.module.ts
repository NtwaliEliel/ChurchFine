import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsModule } from '../transactions/transactions.module';
import { WebhookLog } from './entities/webhook-log.entity';
import { MomoClient } from './momo/momo.client';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';

@Module({
  imports: [TransactionsModule, TypeOrmModule.forFeature([WebhookLog])],
  controllers: [PaymentsController],
  providers: [MomoClient, PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}

