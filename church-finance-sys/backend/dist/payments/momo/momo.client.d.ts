import { ConfigService } from '@nestjs/config';
import type { MomoRequestToPayBody } from './momo.types';
export declare class MomoClient {
    private readonly configService;
    private readonly http;
    private tokenCache?;
    constructor(configService: ConfigService);
    private get targetEnv();
    private get subscriptionKey();
    private get apiUser();
    private get apiKey();
    getAccessToken(): Promise<string>;
    requestToPay(referenceId: string, body: MomoRequestToPayBody): Promise<{
        referenceId: string;
    }>;
}
