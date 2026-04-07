import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import type { MomoRequestToPayBody } from './momo.types';

@Injectable()
export class MomoClient {
  private readonly http: AxiosInstance;
  private tokenCache?: { token: string; expiresAtMs: number };

  constructor(private readonly configService: ConfigService) {
    const baseURL = this.configService.get<string>('MOMO_BASE_URL');
    this.http = axios.create({ baseURL, timeout: 20_000 });
  }

  private get targetEnv() {
    return this.configService.get<string>('MOMO_TARGET_ENV') ?? 'sandbox';
  }

  private get subscriptionKey() {
    return this.configService.get<string>('MOMO_SUBSCRIPTION_KEY') ?? '';
  }

  private get apiUser() {
    return this.configService.get<string>('MOMO_API_USER') ?? '';
  }

  private get apiKey() {
    return this.configService.get<string>('MOMO_API_KEY') ?? '';
  }

  async getAccessToken(): Promise<string> {
    const now = Date.now();
    if (this.tokenCache && now < this.tokenCache.expiresAtMs - 30_000) {
      return this.tokenCache.token;
    }

    const basic = Buffer.from(`${this.apiUser}:${this.apiKey}`).toString('base64');
    const res = await this.http.post(
      '/collection/token/',
      undefined,
      {
        headers: {
          Authorization: `Basic ${basic}`,
          'Ocp-Apim-Subscription-Key': this.subscriptionKey,
        },
      },
    );

    const token = res.data?.access_token as string;
    const expiresIn = Number(res.data?.expires_in ?? 3600);
    this.tokenCache = { token, expiresAtMs: now + expiresIn * 1000 };
    return token;
  }

  /**
   * MTN MoMo Collections: RequestToPay
   * NOTE: This call *does not* confirm success. Final state must be set by webhook (or status polling).
   */
  async requestToPay(referenceId: string, body: MomoRequestToPayBody) {
    const token = await this.getAccessToken();
    await this.http.post('/collection/v1_0/requesttopay', body, {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-Reference-Id': referenceId,
        'X-Target-Environment': this.targetEnv,
        'Ocp-Apim-Subscription-Key': this.subscriptionKey,
        'Content-Type': 'application/json',
      },
    });
    return { referenceId };
  }
}

