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
exports.GivingCategory = void 0;
const typeorm_1 = require("typeorm");
const church_entity_1 = require("../../churches/entities/church.entity");
let GivingCategory = class GivingCategory {
    id;
    churchId;
    church;
    name;
    description;
    isActive;
    createdAt;
    updatedAt;
};
exports.GivingCategory = GivingCategory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], GivingCategory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'church_id' }),
    __metadata("design:type", String)
], GivingCategory.prototype, "churchId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => church_entity_1.Church, { eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'church_id' }),
    __metadata("design:type", church_entity_1.Church)
], GivingCategory.prototype, "church", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], GivingCategory.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], GivingCategory.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], GivingCategory.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], GivingCategory.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], GivingCategory.prototype, "updatedAt", void 0);
exports.GivingCategory = GivingCategory = __decorate([
    (0, typeorm_1.Entity)('giving_categories')
], GivingCategory);
//# sourceMappingURL=giving-category.entity.js.map