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
exports.TithingService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const payments_service_1 = require("../payments/payments.service");
const transaction_entity_1 = require("../transactions/entities/transaction.entity");
const tithe_subscription_entity_1 = require("./entities/tithe-subscription.entity");
let TithingService = class TithingService {
    repo;
    paymentsService;
    constructor(repo, paymentsService) {
        this.repo = repo;
        this.paymentsService = paymentsService;
    }
    getMySubscription(churchId, userId) {
        return this.repo.findOne({ where: { churchId, userId } });
    }
    async upsertMySubscription(churchId, userId, dto) {
        const existing = await this.repo.findOne({ where: { churchId, userId } });
        const nextChargeDate = this.firstOfNextMonth(new Date());
        const entity = existing
            ? Object.assign(existing, dto)
            : this.repo.create({
                churchId,
                userId,
                type: dto.type,
                value: dto.value,
                payerPhone: dto.payerPhone,
                isActive: dto.isActive ?? true,
                nextChargeDate,
                retryCount: 0,
            });
        if (!existing)
            entity.nextChargeDate = nextChargeDate;
        if (dto.isActive === false)
            entity.retryCount = 0;
        return await this.repo.save(entity);
    }
    async runMonthlyCharges() {
        const today = new Date();
        const due = await this.repo.find({
            where: { isActive: true },
        });
        for (const sub of due) {
            if (new Date(sub.nextChargeDate).getTime() > today.getTime())
                continue;
            await this.chargeSubscription(sub);
        }
    }
    async runDailyRetries() {
        const today = new Date();
        const due = await this.repo.find({ where: { isActive: true } });
        for (const sub of due) {
            if (sub.retryCount >= 3)
                continue;
            if (new Date(sub.nextChargeDate).getTime() > today.getTime())
                continue;
            await this.chargeSubscription(sub);
        }
    }
    async chargeSubscription(sub) {
        const amount = await this.calculateAmount(sub);
        if (!amount || amount <= 0) {
            sub.retryCount = Math.min(sub.retryCount + 1, 3);
            await this.repo.save(sub);
            return;
        }
        try {
            await this.paymentsService.initiatePayment({
                churchId: sub.churchId,
                userId: sub.userId,
                dto: {
                    amount,
                    currency: 'RWF',
                    payerPhone: sub.payerPhone,
                    description: 'Automated tithing',
                },
                idempotencyKey: undefined,
            });
            sub.lastChargedAt = new Date();
            sub.retryCount = 0;
            sub.nextChargeDate = this.firstOfNextMonth(new Date());
            await this.repo.save(sub);
        }
        catch (_e) {
            sub.retryCount = Math.min(sub.retryCount + 1, 3);
            await this.repo.save(sub);
        }
    }
    async calculateAmount(sub) {
        if (sub.type === tithe_subscription_entity_1.TitheType.FIXED)
            return Number(sub.value);
        const { start, end } = this.previousMonthWindow(new Date());
        const result = await this.repo.manager
            .createQueryBuilder()
            .select('COALESCE(SUM(t.amount), 0)', 'sum')
            .from('transactions', 't')
            .where('t.church_id = :churchId', { churchId: sub.churchId })
            .andWhere('t.user_id = :userId', { userId: sub.userId })
            .andWhere('t.status = :status', { status: transaction_entity_1.TransactionStatus.SUCCESSFUL })
            .andWhere('t.created_at >= :start AND t.created_at < :end', { start, end })
            .andWhere("(t.metadata->>'source') IS DISTINCT FROM 'auto_tithing'")
            .getRawOne();
        const base = Number(result?.sum ?? 0);
        const pct = Number(sub.value);
        const computed = (base * pct) / 100;
        return Math.round(computed * 100) / 100;
    }
    firstOfNextMonth(now) {
        const y = now.getUTCFullYear();
        const m = now.getUTCMonth();
        return new Date(Date.UTC(y, m + 1, 1));
    }
    previousMonthWindow(now) {
        const y = now.getUTCFullYear();
        const m = now.getUTCMonth();
        const start = new Date(Date.UTC(y, m - 1, 1));
        const end = new Date(Date.UTC(y, m, 1));
        return { start, end };
    }
};
exports.TithingService = TithingService;
__decorate([
    (0, schedule_1.Cron)('0 9 1 * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TithingService.prototype, "runMonthlyCharges", null);
__decorate([
    (0, schedule_1.Cron)('0 10 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TithingService.prototype, "runDailyRetries", null);
exports.TithingService = TithingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tithe_subscription_entity_1.TitheSubscription)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        payments_service_1.PaymentsService])
], TithingService);
//# sourceMappingURL=tithing.service.js.map