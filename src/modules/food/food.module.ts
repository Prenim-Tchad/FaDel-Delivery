import { Module } from '@nestjs/common';
import { FoodController } from './controllers/food.controller';
import { MenuCategoryController } from './controllers/menu-category.controller';
import { MenuItemController } from './controllers/menu-item.controller';
import { FoodService } from './services/food.service';
import { MenuCategoryService } from './services/menu-category.service';
import { MenuItemService } from './services/menu-item.service';
import { FoodRepository } from './repositories/food.repository';
import { MenuCategoryRepository } from './repositories/menu-category.repository';
import { MenuItemRepository } from './repositories/menu-item.repository';

/**
 * FoodModule — regroupe tout ce qui concerne la nourriture
 *
 * controllers : reçoivent les requêtes HTTP
 * providers   : services + repositories (logique métier + données)
 * exports     : ce que les autres modules peuvent utiliser
 */
@Module({
  controllers: [
    FoodController,             // ✅ lead - routes food
    MenuCategoryController,     // ✅ saleh - tâches #31 #32
    MenuItemController,         // ✅ saleh - tâche #33
  ],
  providers: [
    FoodService,                // ✅ lead
    MenuCategoryService,        // ✅ saleh
    MenuItemService,            // ✅ saleh
    FoodRepository,             // ✅ lead
    MenuCategoryRepository,     // ✅ saleh
    MenuItemRepository,         // ✅ saleh
  ],
  exports: [
    FoodService,                // ✅ lead
    MenuCategoryService,        // ✅ saleh
    MenuItemService,            // ✅ saleh
    FoodRepository,             // ✅ lead
    MenuCategoryRepository,     // ✅ saleh
    MenuItemRepository,         // ✅ saleh
  ],
})
export class FoodModule {}