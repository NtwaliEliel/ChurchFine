"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateGivingCategoryDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_giving_category_dto_1 = require("./create-giving-category.dto");
class UpdateGivingCategoryDto extends (0, mapped_types_1.PartialType)(create_giving_category_dto_1.CreateGivingCategoryDto) {
}
exports.UpdateGivingCategoryDto = UpdateGivingCategoryDto;
//# sourceMappingURL=update-giving-category.dto.js.map