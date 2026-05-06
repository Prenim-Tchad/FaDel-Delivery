import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { FoodController } from './controllers/food.controller';
import { MenuCategoryController } from './controllers/menu-category.controller';
import { MenuItemController } from './controllers/menu-item.controller';
import { MenuItemUploadController } from './controllers/menu-item-upload.controller';
import { OptionGroupController } from './controllers/option-group.controller';  // 🆕 tâche #37
import { R2UploadService } from './services/r2-upload.service';
import { RestaurantController } from './controllers/restaurant.controller';
import { FoodRepository } from './repositories/food.repository';
import { MenuCategoryRepository } from './repositories/menu-category.repository';
import { MenuItemRepository } from './repositories/menu-item.repository';
import { RestaurantRepository } from './repositories/restaurant.repository';
import { FoodService } from './services/food.service';
import { MenuCategoryService } from './services/menu-category.service';
import { MenuItemService } from './services/menu-item.service';
import { OptionGroupService } from './services/option-group.service';
import { OptionGroupRepository } from './repositories/option-group.repository';
import { OptionItemService } from './services/option-item.service';             // 🆕 tâche #37
import { OptionItemRepository } from './repositories/option-item.repository';  // 🆕 tâche #37
import { RestaurantService } from './services/restaurant.service';
import { RestaurantOwnerGuard } from './guards/restaurant-owner.guard';
import { MediaService } from './services/media.service';

/**
 * FoodModule — regroupe tout ce qui concerne la nourriture
 */
@Module({
  controllers: [
    FoodController,               // ✅ lead
    RestaurantController,         // ✅ lead
    MenuCategoryController,       // ✅ saleh - tâches #31 #32
    MenuItemController,           // ✅ saleh - tâches #33 #34
    MenuItemUploadController,     // ✅ saleh - tâche #35
    OptionGroupController,        // 🆕 saleh - tâche #37
  ],
  providers: [
    PrismaService,
    FoodService,
    RestaurantService,
    MenuCategoryService,
    MenuItemService,
    R2UploadService,              // ✅ saleh - tâche #35
    FoodRepository,
    MenuCategoryRepository,
    MenuItemRepository,
    RestaurantRepository,
    OptionGroupService,           // ✅ tâche #36
    OptionGroupRepository,        // ✅ tâche #36
    OptionItemService,            // 🆕 tâche #37
    OptionItemRepository,         // 🆕 tâche #37
    RestaurantOwnerGuard,
    MediaService,
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
    OptionGroupService,           // ✅ tâche #36
    OptionGroupRepository,        // ✅ tâche #36
    OptionItemService,            // 🆕 tâche #37
    OptionItemRepository,         // 🆕 tâche #37
    MediaService,
  ],
})
export class FoodModule {}