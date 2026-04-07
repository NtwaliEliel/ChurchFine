import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentsService } from '../payments/payments.service';
import { TransactionStatus } from '../transactions/entities/transaction.entity';
import { TitheSubscription, TitheType } from './entities/tithe-subscription.entity';
import { UpsertTitheSubscriptionDto } from './dto/upsert-tithe-subscription.dto';

@Injectable()
export class TithingService {
  constructor(
    @InjectRepository(TitheSubscription)
    private readonly repo: Repository<TitheSubscription>,
    private readonly paymentsService: PaymentsService,
  ) {}

  getMySubscription(churchId: string, userId: string) {
    return this.repo.findOne({ where: { churchId, userId } });
  }

  async upsertMySubscription(churchId: string, userId: string, dto: UpsertTitheSubscriptionDto) {
    const existing = await this.repo.findOne({ where: { churchId, userId } });
    const nextChargeDate = this.firstOfNextMonth(new Date());

    const entity = existing
      ? Object.assign(existing, dto)
      : this.repo.create({
          churchId,
          userId,
          type: dto.type,
          value: dto.value,
          payerPhone: dto.payerPhone,
          isActive: dto.isActive ?? true,
          nextChargeDate,
          retryCount: 0,
        });

    if (!existing) entity.nextChargeDate = nextChargeDate;
    if (dto.isActive === false) entity.retryCount = 0;

    return await this.repo.save(entity);
  }

  /**
   * Runs on the 1st of every month at 09:00.
   * Charges any subscriptions due on/before today.
   */
  @Cron('0 9 1 * *')
  async runMonthlyCharges() {
    const today = new Date();
    const due = await this.repo.find({
      where: { isActive: true },
    });

    for (const sub of due) {
      if (new Date(sub.nextChargeDate).getTime() > today.getTime()) continue;
      await this.chargeSubscription(sub);
    }
  }

  /**
   * Retries daily for subscriptions that previously failed initiation.
   */
  @Cron('0 10 * * *')
  async runDailyRetries() {
    const today = new Date();
    const due = await this.repo.find({ where: { isActive: true } });
    for (const sub of due) {
      if (sub.retryCount >= 3) continue;
      if (new Date(sub.nextChargeDate).getTime() > today.getTime()) continue;
      await this.chargeSubscription(sub);
    }
  }

  private async chargeSubscription(sub: TitheSubscription) {
    const amount = await this.calculateAmount(sub);
    if (!amount || amount <= 0) {
      // If we can’t compute a safe amount, do not charge.
      sub.retryCount = Math.min(sub.retryCount + 1, 3);
      await this.repo.save(sub);
      return;
    }

    try {
      await this.paymentsService.initiatePayment({
        churchId: sub.churchId,
        userId: sub.userId,
        dto: {
          amount,
          currency: 'RWF',
          payerPhone: sub.payerPhone,
          description: 'Automated tithing',
        },
        idempotencyKey: undefined,
      });

      sub.lastChargedAt = new Date();
      sub.retryCount = 0;
      sub.nextChargeDate = this.firstOfNextMonth(new Date());
      await this.repo.save(sub);
    } catch (_e) {
      sub.retryCount = Math.min(sub.retryCount + 1, 3);
      await this.repo.save(sub);
    }
  }

  /**
   * Assumption (documented):
   * - FIXED: charge the configured value in RWF.
   * - PERCENTAGE: charge value% of the user's successful giving in the previous month,
   *   excluding transactions previously created by the tithing job.
   *
   * In a stricter fintech system, you’d store an explicit base amount / income declaration to avoid ambiguity.
   */
  private async calculateAmount(sub: TitheSubscription): Promise<number> {
    if (sub.type === TitheType.FIXED) return Number(sub.value);

    // Percentage:
    // NOTE: We don't have an "income" table; we use last month's giving sum as a proxy.
    const { start, end } = this.previousMonthWindow(new Date());

    const result = await this.repo.manager
      .createQueryBuilder()
      .select('COALESCE(SUM(t.amount), 0)', 'sum')
      .from('transactions', 't')
      .where('t.church_id = :churchId', { churchId: sub.churchId })
      .andWhere('t.user_id = :userId', { userId: sub.userId })
      .andWhere('t.status = :status', { status: TransactionStatus.SUCCESSFUL })
      .andWhere('t.created_at >= :start AND t.created_at < :end', { start, end })
      .andWhere("(t.metadata->>'source') IS DISTINCT FROM 'auto_tithing'")
      .getRawOne<{ sum: string }>();

    const base = Number(result?.sum ?? 0);
    const pct = Number(sub.value);
    const computed = (base * pct) / 100;
    return Math.round(computed * 100) / 100;
  }

  private firstOfNextMonth(now: Date) {
    const y = now.getUTCFullYear();
    const m = now.getUTCMonth();
    return new Date(Date.UTC(y, m + 1, 1));
  }

  private previousMonthWindow(now: Date) {
    const y = now.getUTCFullYear();
    const m = now.getUTCMonth();
    const start = new Date(Date.UTC(y, m - 1, 1));
    const end = new Date(Date.UTC(y, m, 1));
    return { start, end };
  }
}

