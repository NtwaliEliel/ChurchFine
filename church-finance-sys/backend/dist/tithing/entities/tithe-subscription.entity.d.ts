import { Church } from '../../churches/entities/church.entity';
import { User } from '../../users/entities/user.entity';
export declare enum TitheType {
    PERCENTAGE = "percentage",
    FIXED = "fixed"
}
export declare class TitheSubscription {
    id: string;
    churchId: string;
    church: Church;
    userId: string;
    user: User;
    type: TitheType;
    value: number;
    payerPhone: string;
    isActive: boolean;
    retryCount: number;
    nextChargeDate: Date;
    lastChargedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
