import { Module } from '@nestjs/common';
import { FoodController } from './controllers/food.controller';
import { MenuCategoryController } from './controllers/menu-category.controller';
import { FoodService } from './services/food.service';
import { MenuCategoryService } from './services/menu-category.service';
import { FoodRepository } from './repositories/food.repository';
import { MenuCategoryRepository } from './repositories/menu-category.repository';

/**
 * FoodModule — regroupe tout ce qui concerne la nourriture
 *
 * controllers : reçoivent les requêtes HTTP
 * providers   : services + repositories (logique métier + données)
 * exports     : ce que les autres modules peuvent utiliser
 */
@Module({
  controllers: [
    FoodController,           // ✅ lead - routes food
    MenuCategoryController,   // 🆕 saleh - POST /food/restaurants/:id/menu-categories
  ],
  providers: [
    FoodService,              // ✅ lead
    MenuCategoryService,      // 🆕 saleh
    FoodRepository,           // ✅ lead
    MenuCategoryRepository,   // 🆕 saleh
  ],
  exports: [
    FoodService,              // ✅ lead
    MenuCategoryService,      // 🆕 saleh
    FoodRepository,           // ✅ lead
    MenuCategoryRepository,   // 🆕 saleh
  ],
})
export class FoodModule {}