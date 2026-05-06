import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { FoodController } from './controllers/food.controller';
import { MenuCategoryController } from './controllers/menu-category.controller';
import { MenuItemController } from './controllers/menu-item.controller';
import { RestaurantController } from './controllers/restaurant.controller';
import { RestaurantOwnerGuard } from './guards/restaurant-owner.guard';
import { FoodRepository } from './repositories/food.repository';
import { MenuCategoryRepository } from './repositories/menu-category.repository';
import { MenuItemRepository } from './repositories/menu-item.repository';
import { OptionGroupRepository } from './repositories/option-group.repository';
import { RestaurantRepository } from './repositories/restaurant.repository';
import { FoodService } from './services/food.service';
import { MediaService } from './services/media.service';
import { MenuCategoryService } from './services/menu-category.service';
import { MenuItemService } from './services/menu-item.service';
import { OptionGroupService } from './services/option-group.service';
import { RestaurantService } from './services/restaurant.service';

@Module({
  controllers: [
    FoodController,
    MenuCategoryController,
    MenuItemController,
    RestaurantController,
  ],
  providers: [
    PrismaService,
    FoodService,
    MenuCategoryService,
    MenuItemService,
    RestaurantService,
    FoodRepository,
    MenuCategoryRepository,
    MenuItemRepository,
    OptionGroupService, // 🆕
    OptionGroupRepository, // 🆕
    RestaurantRepository,
    RestaurantOwnerGuard,
    MediaService,
  ],
  exports: [
    PrismaService,
    FoodService,
    MenuCategoryService,
    MenuItemService,
    RestaurantService,
    FoodRepository,
    MenuCategoryRepository,
    MenuItemRepository,
    OptionGroupService, // 🆕
    OptionGroupRepository, // 🆕
    RestaurantRepository,
    MediaService,
  ],
})
export class FoodModule {}
