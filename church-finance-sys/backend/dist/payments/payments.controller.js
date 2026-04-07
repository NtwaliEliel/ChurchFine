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
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const initiate_payment_dto_1 = require("./dto/initiate-payment.dto");
const payments_service_1 = require("./payments.service");
let PaymentsController = class PaymentsController {
    paymentsService;
    configService;
    constructor(paymentsService, configService) {
        this.paymentsService = paymentsService;
        this.configService = configService;
    }
    initiate(user, dto, idempotencyKey) {
        return this.paymentsService.initiatePayment({
            churchId: user.churchId,
            userId: user.sub,
            dto,
            idempotencyKey: idempotencyKey?.trim() || undefined,
        });
    }
    webhookMtn(payload, secret) {
        return this.paymentsService.handleMtnWebhook({
            secretHeader: secret,
            expectedSecret: this.configService.get('WEBHOOK_SECRET') ?? undefined,
            payload,
        });
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('initiate'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Headers)('idempotency-key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, initiate_payment_dto_1.InitiatePaymentDto, String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "initiate", null);
__decorate([
    (0, common_1.Post)('webhook/mtn'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('x-webhook-secret')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "webhookMtn", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, common_1.Controller)({ path: 'payments', version: '1' }),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService,
        config_1.ConfigService])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map