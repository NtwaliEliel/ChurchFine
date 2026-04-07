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
exports.UpsertTitheSubscriptionDto = void 0;
const class_validator_1 = require("class-validator");
const tithe_subscription_entity_1 = require("../entities/tithe-subscription.entity");
class UpsertTitheSubscriptionDto {
    type;
    value;
    payerPhone;
    isActive;
}
exports.UpsertTitheSubscriptionDto = UpsertTitheSubscriptionDto;
__decorate([
    (0, class_validator_1.IsEnum)(tithe_subscription_entity_1.TitheType),
    __metadata("design:type", String)
], UpsertTitheSubscriptionDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], UpsertTitheSubscriptionDto.prototype, "value", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpsertTitheSubscriptionDto.prototype, "payerPhone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpsertTitheSubscriptionDto.prototype, "isActive", void 0);
//# sourceMappingURL=upsert-tithe-subscription.dto.js.map