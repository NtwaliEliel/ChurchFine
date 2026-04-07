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
exports.TransactionsRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const transaction_entity_1 = require("./entities/transaction.entity");
let TransactionsRepository = class TransactionsRepository {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    create(tx) {
        return this.repo.create(tx);
    }
    save(tx) {
        return this.repo.save(tx);
    }
    findById(churchId, id) {
        return this.repo.findOne({ where: { id, churchId } });
    }
    findByIdGlobal(id) {
        return this.repo.findOne({ where: { id } });
    }
    findByIdempotencyKey(churchId, idempotencyKey) {
        return this.repo.findOne({ where: { churchId, idempotencyKey } });
    }
    listByUser(churchId, userId, limit = 50) {
        return this.repo.find({
            where: { churchId, userId },
            order: { createdAt: 'DESC' },
            take: Math.min(limit, 200),
        });
    }
    listByChurch(churchId, limit = 50) {
        return this.repo.find({
            where: { churchId },
            order: { createdAt: 'DESC' },
            take: Math.min(limit, 200),
        });
    }
    async markSuccessful(churchId, id, momoReference) {
        await this.repo.update({ id, churchId }, { status: transaction_entity_1.TransactionStatus.SUCCESSFUL, momoReference, failureReason: null });
    }
    async markFailed(churchId, id, failureReason) {
        await this.repo.update({ id, churchId }, { status: transaction_entity_1.TransactionStatus.FAILED, failureReason });
    }
    countByStatus(churchId, status) {
        return this.repo.count({ where: { churchId, status } });
    }
    async sumSuccessfulSince(churchId, start) {
        const row = await this.repo
            .createQueryBuilder('t')
            .select('COALESCE(SUM(t.amount), 0)', 'sum')
            .where('t.church_id = :churchId', { churchId })
            .andWhere('t.status = :status', { status: transaction_entity_1.TransactionStatus.SUCCESSFUL })
            .andWhere('t.created_at >= :start', { start })
            .getRawOne();
        return Number(row?.sum ?? 0);
    }
};
exports.TransactionsRepository = TransactionsRepository;
exports.TransactionsRepository = TransactionsRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(transaction_entity_1.Transaction)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TransactionsRepository);
//# sourceMappingURL=transactions.repository.js.map