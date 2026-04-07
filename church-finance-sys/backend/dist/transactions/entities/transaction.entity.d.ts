import { Church } from '../../churches/entities/church.entity';
import { User } from '../../users/entities/user.entity';
import { GivingCategory } from '../../giving-categories/entities/giving-category.entity';
export declare enum TransactionStatus {
    PENDING = "pending",
    SUCCESSFUL = "successful",
    FAILED = "failed",
    CANCELLED = "cancelled"
}
export declare class Transaction {
    id: string;
    churchId: string;
    church: Church;
    userId: string;
    user: User;
    categoryId: string;
    category: GivingCategory;
    amount: number;
    currency: string;
    status: TransactionStatus;
    momoReference: string;
    idempotencyKey: string;
    payerPhone: string;
    description: string;
    metadata: Record<string, any>;
    failureReason: string | null;
    createdAt: Date;
    updatedAt: Date;
}
