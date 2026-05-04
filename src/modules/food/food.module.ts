import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { FoodController } from './controllers/food.controller';
import { MenuCategoryController } from './controllers/menu-category.controller';
import { MenuItemController } from './controllers/menu-item.controller';
import { FoodRepository } from './repositories/food.repository';
import { MenuCategoryRepository } from './repositories/menu-category.repository';
import { MenuItemRepository } from './repositories/menu-item.repository';
import { FoodService } from './services/food.service';
import { MenuCategoryService } from './services/menu-category.service';
import { MenuItemService } from './services/menu-item.service';

@Module({
  controllers: [FoodController, MenuCategoryController, MenuItemController],
  providers: [
    PrismaService,
    FoodService,
    MenuCategoryService,
    MenuItemService,
    FoodRepository,
    MenuCategoryRepository,
    MenuItemRepository,
  ],
  exports: [
    PrismaService,
    FoodService,
    MenuCategoryService,
    MenuItemService,
    FoodRepository,
    MenuCategoryRepository,
    MenuItemRepository,
  ],
  exports: [
    PrismaService,
    FoodService,
    MenuCategoryService,
    MenuItemService,
    FoodRepository,
    MenuCategoryRepository,
    MenuItemRepository,
  ],
})
export class FoodModule {}
