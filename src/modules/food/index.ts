// Module
export { FoodModule } from './food.module';
// Controllers
export { FoodController } from './controllers/food.controller';
// Services
export { FoodService } from './services/food.service';
// Repositories
export { FoodRepository } from './repositories/food.repository';
// Entities
export { Food } from './entities/food.entity';
// DTOs
export { CreateFoodDto } from './dtos/create-food.dto';
export { UpdateFoodDto } from './dtos/update-food.dto';
export { FoodFiltersDto } from './dtos/food-filters.dto';
// Enums
export { FoodCategory, FoodStatus, FoodType } from './enums/food.enums';
// Guards
export { FoodPartnerGuard } from './guards/food-partner.guard';
export { RestaurantOwnerGuard } from './guards/restaurant-owner.guard';

// ============================================
// Menu Categories — Saleh (tâches #31 #32)
// ============================================
export { MenuCategoryController } from './controllers/menu-category.controller';
export { MenuCategoryService } from './services/menu-category.service';
export { MenuCategoryRepository } from './repositories/menu-category.repository';
export { MenuCategory, MultiLangField } from './entities/menu-category.entity';
export {
  CreateMenuCategoryDto,
  MultiLangFieldDto,
} from './dtos/create-menu-category.dto';
export { UpdateMenuCategoryDto } from './dtos/update-menu-category.dto';

// ============================================
// Menu Items — Saleh (tâches #33 #34)
// ============================================
// Menu Items — Saleh (tâche #33)
// ============================================
// Controller
export { MenuItemController } from './controllers/menu-item.controller';
export { MenuItemService } from './services/menu-item.service';
export { MenuItemRepository } from './repositories/menu-item.repository';
export { MenuItem } from './entities/menu-item.entity';
export { CreateMenuItemDto } from './dtos/create-menu-item.dto';
export { UpdateMenuItemDto } from './dtos/update-menu-item.dto';

// ============================================
// Upload Photo — Saleh (tâche #35)
// ============================================
export { MenuItemUploadController } from './controllers/menu-item-upload.controller';
export { R2UploadService } from './services/r2-upload.service';
export { UploadPhotoResponseDto } from './dtos/upload-photo.dto';
