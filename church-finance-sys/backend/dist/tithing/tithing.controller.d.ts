import { type AuthUser } from '../common/decorators/current-user.decorator';
import { UpsertTitheSubscriptionDto } from './dto/upsert-tithe-subscription.dto';
import { TithingService } from './tithing.service';
export declare class TithingController {
    private readonly service;
    constructor(service: TithingService);
    getMine(user: AuthUser): Promise<import("./entities/tithe-subscription.entity").TitheSubscription | null>;
    upsertMine(user: AuthUser, dto: UpsertTitheSubscriptionDto): Promise<import("./entities/tithe-subscription.entity").TitheSubscription>;
}
