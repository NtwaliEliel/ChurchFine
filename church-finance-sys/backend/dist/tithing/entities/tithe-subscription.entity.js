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
exports.TitheSubscription = exports.TitheType = void 0;
const typeorm_1 = require("typeorm");
const church_entity_1 = require("../../churches/entities/church.entity");
const user_entity_1 = require("../../users/entities/user.entity");
var TitheType;
(function (TitheType) {
    TitheType["PERCENTAGE"] = "percentage";
    TitheType["FIXED"] = "fixed";
})(TitheType || (exports.TitheType = TitheType = {}));
let TitheSubscription = class TitheSubscription {
    id;
    churchId;
    church;
    userId;
    user;
    type;
    value;
    payerPhone;
    isActive;
    retryCount;
    nextChargeDate;
    lastChargedAt;
    createdAt;
    updatedAt;
};
exports.TitheSubscription = TitheSubscription;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TitheSubscription.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'church_id' }),
    __metadata("design:type", String)
], TitheSubscription.prototype, "churchId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => church_entity_1.Church, { eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'church_id' }),
    __metadata("design:type", church_entity_1.Church)
], TitheSubscription.prototype, "church", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], TitheSubscription.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], TitheSubscription.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: TitheType, default: TitheType.PERCENTAGE }),
    __metadata("design:type", String)
], TitheSubscription.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], TitheSubscription.prototype, "value", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payer_phone', length: 30 }),
    __metadata("design:type", String)
], TitheSubscription.prototype, "payerPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], TitheSubscription.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'retry_count', default: 0 }),
    __metadata("design:type", Number)
], TitheSubscription.prototype, "retryCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'next_charge_date', type: 'date' }),
    __metadata("design:type", Date)
], TitheSubscription.prototype, "nextChargeDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_charged_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], TitheSubscription.prototype, "lastChargedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], TitheSubscription.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], TitheSubscription.prototype, "updatedAt", void 0);
exports.TitheSubscription = TitheSubscription = __decorate([
    (0, typeorm_1.Entity)('tithe_subscriptions')
], TitheSubscription);
//# sourceMappingURL=tithe-subscription.entity.js.map