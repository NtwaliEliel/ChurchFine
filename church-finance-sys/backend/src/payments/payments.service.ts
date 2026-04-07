import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Transaction, TransactionStatus } from '../transactions/entities/transaction.entity';
import { TransactionsRepository } from '../transactions/transactions.repository';
import { MomoClient } from './momo/momo.client';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { WebhookLog } from './entities/webhook-log.entity';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly momoClient: MomoClient,
    private readonly txRepo: TransactionsRepository,
    @InjectRepository(WebhookLog)
    private readonly webhookRepo: Repository<WebhookLog>,
  ) {}

  /**
   * Creates a PENDING transaction and triggers MoMo RequestToPay.
   * IMPORTANT: This does NOT mark a transaction successful. Only webhook can settle it.
   */
  async initiatePayment(params: {
    churchId: string;
    userId: string;
    dto: InitiatePaymentDto;
    idempotencyKey?: string;
  }) {
    const { churchId, userId, dto } = params;
    const currency = dto.currency ?? 'RWF';
    const idempotencyKey = params.idempotencyKey ?? uuidv4();

    const existing = await this.txRepo.findByIdempotencyKey(churchId, idempotencyKey);
    if (existing) return existing;

    const tx = this.txRepo.create({
      churchId,
      userId,
      categoryId: dto.categoryId ?? null,
      amount: dto.amount,
      currency,
      status: TransactionStatus.PENDING,
      idempotencyKey,
      payerPhone: dto.payerPhone,
      description: dto.description ?? null,
      metadata: { source: 'mobile', provider: 'mtn_momo' },
    } as Partial<Transaction>);

    const saved = await this.txRepo.save(tx as Transaction);

    await this.momoClient.requestToPay(saved.id, {
      amount: saved.amount.toFixed(2),
      currency: saved.currency,
      externalId: saved.id,
      payer: { partyIdType: 'MSISDN', partyId: saved.payerPhone },
      payerMessage: 'ChurchFine payment',
      payeeNote: dto.description ?? 'Giving',
    });

    // Keep PENDING. Webhook will settle.
    return saved;
  }

  /**
   * Webhook settlement handler.
   * We always log payload first; we only update the transaction if the payload is valid and not a duplicate.
   */
  async handleMtnWebhook(params: {
    secretHeader?: string;
    expectedSecret?: string;
    payload: any;
  }) {
    const { secretHeader, expectedSecret, payload } = params;

    if (expectedSecret) {
      if (!secretHeader || secretHeader !== expectedSecret) throw new UnauthorizedException();
    }

    const reference =
      payload?.referenceId ??
      payload?.reference ??
      payload?.transactionId ??
      payload?.externalId ??
      null;

    const status = String(payload?.status ?? payload?.state ?? payload?.result ?? 'unknown').toLowerCase();

    const log = this.webhookRepo.create({
      provider: 'mtn_momo',
      reference: reference ?? undefined,
      payload,
      status,
      processed: false,
    });
    const savedLog = await this.webhookRepo.save(log);

    if (!reference) {
      throw new BadRequestException('Missing reference');
    }

    /**
     * Multi-tenant note:
     * MTN callbacks don’t carry tenant identity. We scope by transaction id (UUID) which is globally unique.
     * In a hardened system, the callback should include a signed tenant hint (or we maintain a reference->tenant map).
     */
    const tx = await this.txRepo.findByIdGlobal(reference);
    if (!tx) {
      return { ok: true, ignored: true };
    }

    if (tx.status !== TransactionStatus.PENDING) {
      await this.webhookRepo.update({ id: savedLog.id }, { processed: true });
      return { ok: true, duplicate: true };
    }

    if (status.includes('success')) {
      await this.txRepo.markSuccessful(tx.churchId, tx.id, payload?.financialTransactionId ?? payload?.momoRef);
    } else if (status.includes('fail') || status.includes('reject') || status.includes('cancel')) {
      await this.txRepo.markFailed(tx.churchId, tx.id, payload?.reason ?? payload?.message ?? 'Payment failed');
    } else {
      // Keep pending for unknown statuses.
    }

    await this.webhookRepo.update({ id: savedLog.id }, { processed: true });
    return { ok: true };
  }

  // No private lookup needed; repository exposes findByIdGlobal().
}

