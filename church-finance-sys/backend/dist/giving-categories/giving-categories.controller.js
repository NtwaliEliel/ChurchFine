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
exports.GivingCategoriesController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const giving_categories_service_1 = require("./giving-categories.service");
const create_giving_category_dto_1 = require("./dto/create-giving-category.dto");
const update_giving_category_dto_1 = require("./dto/update-giving-category.dto");
let GivingCategoriesController = class GivingCategoriesController {
    service;
    constructor(service) {
        this.service = service;
    }
    list(user) {
        return this.service.list(user.churchId);
    }
    create(user, dto) {
        return this.service.create(user.churchId, dto);
    }
    update(user, id, dto) {
        return this.service.update(user.churchId, id, dto);
    }
};
exports.GivingCategoriesController = GivingCategoriesController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GivingCategoriesController.prototype, "list", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'super_admin'),
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_giving_category_dto_1.CreateGivingCategoryDto]),
    __metadata("design:returntype", void 0)
], GivingCategoriesController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'super_admin'),
    (0, common_1.Patch)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_giving_category_dto_1.UpdateGivingCategoryDto]),
    __metadata("design:returntype", void 0)
], GivingCategoriesController.prototype, "update", null);
exports.GivingCategoriesController = GivingCategoriesController = __decorate([
    (0, common_1.Controller)({ path: 'giving-categories', version: '1' }),
    __metadata("design:paramtypes", [giving_categories_service_1.GivingCategoriesService])
], GivingCategoriesController);
//# sourceMappingURL=giving-categories.controller.js.map