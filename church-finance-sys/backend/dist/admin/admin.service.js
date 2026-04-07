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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const transactions_repository_1 = require("../transactions/transactions.repository");
const users_service_1 = require("../users/users.service");
const transaction_entity_1 = require("../transactions/entities/transaction.entity");
let AdminService = class AdminService {
    txRepo;
    usersService;
    constructor(txRepo, usersService) {
        this.txRepo = txRepo;
        this.usersService = usersService;
    }
    async dashboard(churchId) {
        const now = new Date();
        const y = now.getUTCFullYear();
        const m = now.getUTCMonth();
        const monthStart = new Date(Date.UTC(y, m, 1));
        const yearStart = new Date(Date.UTC(y, 0, 1));
        const [monthTotal, yearTotal] = await Promise.all([
            this.txRepo.sumSuccessfulSince(churchId, monthStart),
            this.txRepo.sumSuccessfulSince(churchId, yearStart),
        ]);
        const [pending, failed] = await Promise.all([
            this.txRepo.countByStatus(churchId, transaction_entity_1.TransactionStatus.PENDING),
            this.txRepo.countByStatus(churchId, transaction_entity_1.TransactionStatus.FAILED),
        ]);
        const members = (await this.usersService.findAllByChurch(churchId)).length;
        return {
            totals: {
                month: monthTotal,
                year: yearTotal,
            },
            counts: { members, pending, failed },
        };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [transactions_repository_1.TransactionsRepository,
        users_service_1.UsersService])
], AdminService);
//# sourceMappingURL=admin.service.js.map