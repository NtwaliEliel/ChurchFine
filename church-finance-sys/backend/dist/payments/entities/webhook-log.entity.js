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
exports.WebhookLog = void 0;
const typeorm_1 = require("typeorm");
let WebhookLog = class WebhookLog {
    id;
    provider;
    reference;
    payload;
    status;
    processed;
    receivedAt;
};
exports.WebhookLog = WebhookLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], WebhookLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, default: 'mtn_momo' }),
    __metadata("design:type", String)
], WebhookLog.prototype, "provider", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], WebhookLog.prototype, "reference", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Object)
], WebhookLog.prototype, "payload", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], WebhookLog.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], WebhookLog.prototype, "processed", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'received_at' }),
    __metadata("design:type", Date)
], WebhookLog.prototype, "receivedAt", void 0);
exports.WebhookLog = WebhookLog = __decorate([
    (0, typeorm_1.Entity)('webhook_logs')
], WebhookLog);
//# sourceMappingURL=webhook-log.entity.js.map