export declare class WebhookLog {
    id: string;
    provider: string;
    reference: string;
    payload: Record<string, any>;
    status: string;
    processed: boolean;
    receivedAt: Date;
}
