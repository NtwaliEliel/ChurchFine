import { ConfigService } from '@nestjs/config';
import { type AuthUser } from '../common/decorators/current-user.decorator';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private readonly paymentsService;
    private readonly configService;
    constructor(paymentsService: PaymentsService, configService: ConfigService);
    initiate(user: AuthUser, dto: InitiatePaymentDto, idempotencyKey?: string): Promise<import("../transactions/entities/transaction.entity").Transaction>;
    webhookMtn(payload: any, secret?: string): Promise<{
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
