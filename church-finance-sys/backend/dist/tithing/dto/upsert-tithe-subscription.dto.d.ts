import { TitheType } from '../entities/tithe-subscription.entity';
export declare class UpsertTitheSubscriptionDto {
    type: TitheType;
    value: number;
    payerPhone: string;
    isActive?: boolean;
}
