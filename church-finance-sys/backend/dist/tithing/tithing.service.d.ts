import { Repository } from 'typeorm';
import { PaymentsService } from '../payments/payments.service';
import { TitheSubscription } from './entities/tithe-subscription.entity';
import { UpsertTitheSubscriptionDto } from './dto/upsert-tithe-subscription.dto';
export declare class TithingService {
    private readonly repo;
    private readonly paymentsService;
    constructor(repo: Repository<TitheSubscription>, paymentsService: PaymentsService);
    getMySubscription(churchId: string, userId: string): Promise<TitheSubscription | null>;
    upsertMySubscription(churchId: string, userId: string, dto: UpsertTitheSubscriptionDto): Promise<TitheSubscription>;
    runMonthlyCharges(): Promise<void>;
    runDailyRetries(): Promise<void>;
    private chargeSubscription;
    private calculateAmount;
    private firstOfNextMonth;
    private previousMonthWindow;
}
