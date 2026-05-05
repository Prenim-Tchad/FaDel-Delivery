import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { FoodController } from './controllers/food.controller';
import { MenuCategoryController } from './controllers/menu-category.controller';
import { MenuItemController } from './controllers/menu-item.controller';
import { MenuItemUploadController } from './controllers/menu-item-upload.controller';
import { RestaurantController } from './controllers/restaurant.controller';
import { FoodService } from './services/food.service';
import { MenuCategoryService } from './services/menu-category.service';
import { MenuItemService } from './services/menu-item.service';
import { R2UploadService } from './services/r2-upload.service';
import { RestaurantService } from './services/restaurant.service';
import { FoodRepository } from './repositories/food.repository';
import { MenuCategoryRepository } from './repositories/menu-category.repository';
import { MenuItemRepository } from './repositories/menu-item.repository';
import { RestaurantRepository } from './repositories/restaurant.repository';

/**
 * FoodModule — regroupe tout ce qui concerne la nourriture
 */
@Module({
  controllers: [
    FoodController,               // ✅ lead
    RestaurantController,         // ✅ lead
    MenuCategoryController,       // ✅ saleh - tâches #31 #32
    MenuItemController,           // ✅ saleh - tâches #33 #34
    MenuItemUploadController,     // 🆕 saleh - tâche #35
  ],
  providers: [
    PrismaService,                // BDD Prisma
    FoodService,                  // ✅ lead
    RestaurantService,            // ✅ lead
    MenuCategoryService,          // ✅ saleh
    MenuItemService,              // ✅ saleh
    R2UploadService,              // 🆕 saleh - tâche #35
    FoodRepository,               // ✅ lead
    MenuCategoryRepository,       // ✅ saleh
    MenuItemRepository,           // ✅ saleh
    RestaurantRepository,         // ✅ lead
  ],
  exports: [
    PrismaService,
    FoodService,
    RestaurantService,
    MenuCategoryService,
    MenuItemService,
    R2UploadService,
    FoodRepository,
    MenuCategoryRepository,
    MenuItemRepository,
    RestaurantRepository,
  ],
})
export class FoodModule {}