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

// ============================================
// Menu Categories — Saleh (tâches #31 #32)
// ============================================
// Controller
export { MenuCategoryController } from './controllers/menu-category.controller';
// Service
export { MenuCategoryService } from './services/menu-category.service';
// Repository
export { MenuCategoryRepository } from './repositories/menu-category.repository';
// Entity
export { MenuCategory, MultiLangField } from './entities/menu-category.entity';
// DTOs
export {
  CreateMenuCategoryDto,
  MultiLangFieldDto,
} from './dtos/create-menu-category.dto';
export { UpdateMenuCategoryDto } from './dtos/update-menu-category.dto';

// ============================================
// Menu Items — Saleh (tâche #33)
// ============================================
// Controller
// ============================================
// Menu Items — Saleh (tâches #33 #34)
// ============================================
// Controller
export { MenuItemController } from './controllers/menu-item.controller';
// Service
export { MenuItemService } from './services/menu-item.service';
// Repository
export { MenuItemRepository } from './repositories/menu-item.repository';
// Entity
export { MenuItem } from './entities/menu-item.entity';
// DTO
export { CreateMenuItemDto } from './dtos/create-menu-item.dto';
// DTOs
export { UpdateMenuItemDto } from './dtos/update-menu-item.dto';
