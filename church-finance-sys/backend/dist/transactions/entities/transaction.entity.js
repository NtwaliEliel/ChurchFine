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
exports.Transaction = exports.TransactionStatus = void 0;
const typeorm_1 = require("typeorm");
const church_entity_1 = require("../../churches/entities/church.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const giving_category_entity_1 = require("../../giving-categories/entities/giving-category.entity");
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["PENDING"] = "pending";
    TransactionStatus["SUCCESSFUL"] = "successful";
    TransactionStatus["FAILED"] = "failed";
    TransactionStatus["CANCELLED"] = "cancelled";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
let Transaction = class Transaction {
    id;
    churchId;
    church;
    userId;
    user;
    categoryId;
    category;
    amount;
    currency;
    status;
    momoReference;
    idempotencyKey;
    payerPhone;
    description;
    metadata;
    failureReason;
    createdAt;
    updatedAt;
};
exports.Transaction = Transaction;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Transaction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'church_id' }),
    __metadata("design:type", String)
], Transaction.prototype, "churchId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => church_entity_1.Church, { eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'church_id' }),
    __metadata("design:type", church_entity_1.Church)
], Transaction.prototype, "church", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], Transaction.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Transaction.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'category_id', nullable: true }),
    __metadata("design:type", String)
], Transaction.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => giving_category_entity_1.GivingCategory, { eager: false, nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'category_id' }),
    __metadata("design:type", giving_category_entity_1.GivingCategory)
], Transaction.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 14, scale: 2 }),
    __metadata("design:type", Number)
], Transaction.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 10, default: 'RWF' }),
    __metadata("design:type", String)
], Transaction.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TransactionStatus,
        default: TransactionStatus.PENDING,
    }),
    __metadata("design:type", String)
], Transaction.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'momo_reference', length: 100, nullable: true }),
    __metadata("design:type", String)
], Transaction.prototype, "momoReference", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'idempotency_key', unique: true }),
    __metadata("design:type", String)
], Transaction.prototype, "idempotencyKey", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payer_phone', length: 30 }),
    __metadata("design:type", String)
], Transaction.prototype, "payerPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Transaction.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Transaction.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'failure_reason', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Transaction.prototype, "failureReason", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Transaction.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Transaction.prototype, "updatedAt", void 0);
exports.Transaction = Transaction = __decorate([
    (0, typeorm_1.Entity)('transactions')
], Transaction);
//# sourceMappingURL=transaction.entity.js.map