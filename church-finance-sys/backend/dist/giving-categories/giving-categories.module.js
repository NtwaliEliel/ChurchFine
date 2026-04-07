"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GivingCategoriesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const giving_category_entity_1 = require("./entities/giving-category.entity");
const giving_categories_service_1 = require("./giving-categories.service");
const giving_categories_controller_1 = require("./giving-categories.controller");
let GivingCategoriesModule = class GivingCategoriesModule {
};
exports.GivingCategoriesModule = GivingCategoriesModule;
exports.GivingCategoriesModule = GivingCategoriesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([giving_category_entity_1.GivingCategory])],
        controllers: [giving_categories_controller_1.GivingCategoriesController],
        providers: [giving_categories_service_1.GivingCategoriesService],
        exports: [giving_categories_service_1.GivingCategoriesService, typeorm_1.TypeOrmModule],
    })
], GivingCategoriesModule);
//# sourceMappingURL=giving-categories.module.js.map