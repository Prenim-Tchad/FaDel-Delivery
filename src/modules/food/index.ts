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
// DTO
export { CreateMenuCategoryDto, MultiLangFieldDto } from './dtos/create-menu-category.dto';
export { UpdateMenuCategoryDto } from './dtos/update-menu-category.dto'; // 🆕
