import { Repository } from 'typeorm';
import { Transaction } from '../transactions/entities/transaction.entity';
import { TransactionsRepository } from '../transactions/transactions.repository';
import { MomoClient } from './momo/momo.client';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { WebhookLog } from './entities/webhook-log.entity';
export declare class PaymentsService {
    private readonly momoClient;
    private readonly txRepo;
    private readonly webhookRepo;
    constructor(momoClient: MomoClient, txRepo: TransactionsRepository, webhookRepo: Repository<WebhookLog>);
    initiatePayment(params: {
        churchId: string;
        userId: string;
        dto: InitiatePaymentDto;
        idempotencyKey?: string;
    }): Promise<Transaction>;
    handleMtnWebhook(params: {
        secretHeader?: string;
        expectedSecret?: string;
        payload: any;
    }): Promise<{
        ok: boolean;
        ignored: boolean;
        duplicate?: undefined;
    } | {
        ok: boolean;
        duplicate: boolean;
        ignored?: undefined;
    } | {
        ok: boolean;
        ignored?: undefined;
        duplicate?: undefined;
    }>;
}
