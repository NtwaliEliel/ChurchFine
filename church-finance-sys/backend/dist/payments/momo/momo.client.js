"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MomoClient = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = __importDefault(require("axios"));
let MomoClient = class MomoClient {
    configService;
    http;
    tokenCache;
    constructor(configService) {
        this.configService = configService;
        const baseURL = this.configService.get('MOMO_BASE_URL');
        this.http = axios_1.default.create({ baseURL, timeout: 20_000 });
    }
    get targetEnv() {
        return this.configService.get('MOMO_TARGET_ENV') ?? 'sandbox';
    }
    get subscriptionKey() {
        return this.configService.get('MOMO_SUBSCRIPTION_KEY') ?? '';
    }
    get apiUser() {
        return this.configService.get('MOMO_API_USER') ?? '';
    }
    get apiKey() {
        return this.configService.get('MOMO_API_KEY') ?? '';
    }
    async getAccessToken() {
        const now = Date.now();
        if (this.tokenCache && now < this.tokenCache.expiresAtMs - 30_000) {
            return this.tokenCache.token;
        }
        const basic = Buffer.from(`${this.apiUser}:${this.apiKey}`).toString('base64');
        const res = await this.http.post('/collection/token/', undefined, {
            headers: {
                Authorization: `Basic ${basic}`,
                'Ocp-Apim-Subscription-Key': this.subscriptionKey,
            },
        });
        const token = res.data?.access_token;
        const expiresIn = Number(res.data?.expires_in ?? 3600);
        this.tokenCache = { token, expiresAtMs: now + expiresIn * 1000 };
        return token;
    }
    async requestToPay(referenceId, body) {
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
};
exports.MomoClient = MomoClient;
exports.MomoClient = MomoClient = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MomoClient);
//# sourceMappingURL=momo.client.js.map