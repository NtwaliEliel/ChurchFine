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
exports.Church = exports.SubscriptionTier = void 0;
const typeorm_1 = require("typeorm");
var SubscriptionTier;
(function (SubscriptionTier) {
    SubscriptionTier["FREE"] = "free";
    SubscriptionTier["PRO"] = "pro";
    SubscriptionTier["ENTERPRISE"] = "enterprise";
})(SubscriptionTier || (exports.SubscriptionTier = SubscriptionTier = {}));
let Church = class Church {
    id;
    name;
    country;
    currency;
    subscriptionTier;
    isActive;
    createdAt;
    updatedAt;
};
exports.Church = Church;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Church.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], Church.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, default: 'Rwanda' }),
    __metadata("design:type", String)
], Church.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 10, default: 'RWF' }),
    __metadata("design:type", String)
], Church.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: SubscriptionTier,
        default: SubscriptionTier.FREE,
        name: 'subscription_tier',
    }),
    __metadata("design:type", String)
], Church.prototype, "subscriptionTier", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], Church.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Church.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Church.prototype, "updatedAt", void 0);
exports.Church = Church = __decorate([
    (0, typeorm_1.Entity)('churches')
], Church);
//# sourceMappingURL=church.entity.js.map