export declare enum SubscriptionTier {
    FREE = "free",
    PRO = "pro",
    ENTERPRISE = "enterprise"
}
export declare class Church {
    id: string;
    name: string;
    country: string;
    currency: string;
    subscriptionTier: SubscriptionTier;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
