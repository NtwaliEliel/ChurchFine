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
exports.TithingController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const upsert_tithe_subscription_dto_1 = require("./dto/upsert-tithe-subscription.dto");
const tithing_service_1 = require("./tithing.service");
let TithingController = class TithingController {
    service;
    constructor(service) {
        this.service = service;
    }
    getMine(user) {
        return this.service.getMySubscription(user.churchId, user.sub);
    }
    upsertMine(user, dto) {
        return this.service.upsertMySubscription(user.churchId, user.sub, dto);
    }
};
exports.TithingController = TithingController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('subscription'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TithingController.prototype, "getMine", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('subscription'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, upsert_tithe_subscription_dto_1.UpsertTitheSubscriptionDto]),
    __metadata("design:returntype", void 0)
], TithingController.prototype, "upsertMine", null);
exports.TithingController = TithingController = __decorate([
    (0, common_1.Controller)({ path: 'tithing', version: '1' }),
    __metadata("design:paramtypes", [tithing_service_1.TithingService])
], TithingController);
//# sourceMappingURL=tithing.controller.js.map