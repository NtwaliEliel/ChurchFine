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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const uuid_1 = require("uuid");
const transaction_entity_1 = require("../transactions/entities/transaction.entity");
const transactions_repository_1 = require("../transactions/transactions.repository");
const momo_client_1 = require("./momo/momo.client");
const webhook_log_entity_1 = require("./entities/webhook-log.entity");
let PaymentsService = class PaymentsService {
    momoClient;
    txRepo;
    webhookRepo;
    constructor(momoClient, txRepo, webhookRepo) {
        this.momoClient = momoClient;
        this.txRepo = txRepo;
        this.webhookRepo = webhookRepo;
    }
    async initiatePayment(params) {
        const { churchId, userId, dto } = params;
        const currency = dto.currency ?? 'RWF';
        const idempotencyKey = params.idempotencyKey ?? (0, uuid_1.v4)();
        const existing = await this.txRepo.findByIdempotencyKey(churchId, idempotencyKey);
        if (existing)
            return existing;
        const tx = this.txRepo.create({
            churchId,
            userId,
            categoryId: dto.categoryId ?? null,
            amount: dto.amount,
            currency,
            status: transaction_entity_1.TransactionStatus.PENDING,
            idempotencyKey,
            payerPhone: dto.payerPhone,
            description: dto.description ?? null,
            metadata: { source: 'mobile', provider: 'mtn_momo' },
        });
        const saved = await this.txRepo.save(tx);
        await this.momoClient.requestToPay(saved.id, {
            amount: saved.amount.toFixed(2),
            currency: saved.currency,
            externalId: saved.id,
            payer: { partyIdType: 'MSISDN', partyId: saved.payerPhone },
            payerMessage: 'ChurchFine payment',
            payeeNote: dto.description ?? 'Giving',
        });
        return saved;
    }
    async handleMtnWebhook(params) {
        const { secretHeader, expectedSecret, payload } = params;
        if (expectedSecret) {
            if (!secretHeader || secretHeader !== expectedSecret)
                throw new common_1.UnauthorizedException();
        }
        const reference = payload?.referenceId ??
            payload?.reference ??
            payload?.transactionId ??
            payload?.externalId ??
            null;
        const status = String(payload?.status ?? payload?.state ?? payload?.result ?? 'unknown').toLowerCase();
        const log = this.webhookRepo.create({
            provider: 'mtn_momo',
            reference: reference ?? undefined,
            payload,
            status,
            processed: false,
        });
        const savedLog = await this.webhookRepo.save(log);
        if (!reference) {
            throw new common_1.BadRequestException('Missing reference');
        }
        const tx = await this.txRepo.findByIdGlobal(reference);
        if (!tx) {
            return { ok: true, ignored: true };
        }
        if (tx.status !== transaction_entity_1.TransactionStatus.PENDING) {
            await this.webhookRepo.update({ id: savedLog.id }, { processed: true });
            return { ok: true, duplicate: true };
        }
        if (status.includes('success')) {
            await this.txRepo.markSuccessful(tx.churchId, tx.id, payload?.financialTransactionId ?? payload?.momoRef);
        }
        else if (status.includes('fail') || status.includes('reject') || status.includes('cancel')) {
            await this.txRepo.markFailed(tx.churchId, tx.id, payload?.reason ?? payload?.message ?? 'Payment failed');
        }
        else {
        }
        await this.webhookRepo.update({ id: savedLog.id }, { processed: true });
        return { ok: true };
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, typeorm_1.InjectRepository)(webhook_log_entity_1.WebhookLog)),
    __metadata("design:paramtypes", [momo_client_1.MomoClient,
        transactions_repository_1.TransactionsRepository,
        typeorm_2.Repository])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map