import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { FoodRepository } from '../repositories/food.repository';
import { CreateFoodDto } from '../dtos/create-food.dto';
import { UpdateFoodDto } from '../dtos/update-food.dto';
import { FoodFiltersDto } from '../dtos/food-filters.dto';
import { Food } from '../entities/food.entity';
import { FoodStatus } from '../enums/food.enums';

@Injectable()
export class FoodService {
  constructor(private readonly foodRepository: FoodRepository) {}

  async create(createFoodDto: CreateFoodDto): Promise<Food> {
    try {
      // Validate business rules
      if (createFoodDto.price <= 0) {
        throw new BadRequestException('Price must be greater than 0');
      }

      if (createFoodDto.preparationTime <= 0) {
        throw new BadRequestException(
          'Preparation time must be greater than 0',
        );
      }

      return await this.foodRepository.create(createFoodDto);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to create food item');
    }
  }

  async findAll(filters: FoodFiltersDto = {}): Promise<{
    items: Food[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const result = await this.foodRepository.findAll(filters);
      const totalPages = Math.ceil(result.total / result.limit);

      return {
        ...result,
        totalPages,
      };
    } catch {
      throw new BadRequestException('Failed to retrieve food items');
    }
  }

  async findOne(id: string): Promise<Food> {
    const food = await this.foodRepository.findOne(id);
    if (!food) {
      throw new NotFoundException(`Food item with ID ${id} not found`);
    }
    return food;
  }

  async update(id: string, updateFoodDto: UpdateFoodDto): Promise<Food> {
    // Check if food exists
    await this.findOne(id);

    try {
      // Validate business rules for update
      if (updateFoodDto.price !== undefined && updateFoodDto.price <= 0) {
        throw new BadRequestException('Price must be greater than 0');
      }

      if (
        updateFoodDto.preparationTime !== undefined &&
        updateFoodDto.preparationTime <= 0
      ) {
        throw new BadRequestException(
          'Preparation time must be greater than 0',
        );
      }

      const updatedFood = await this.foodRepository.update(id, updateFoodDto);
      if (!updatedFood) {
        throw new NotFoundException(`Food item with ID ${id} not found`);
      }

      return updatedFood;
    } catch {
      throw new BadRequestException('Failed to update food item');
    }
  }

  async remove(id: string): Promise<void> {
    // Check if food exists
    await this.findOne(id);

    const deleted = await this.foodRepository.remove(id);
    if (!deleted) {
      throw new NotFoundException(`Food item with ID ${id} not found`);
    }
  }

  async findByPartner(partnerId: string): Promise<Food[]> {
    try {
      return await this.foodRepository.findByPartner(partnerId);
    } catch {
      throw new BadRequestException('Failed to retrieve partner food items');
    }
  }

  async findFeatured(): Promise<Food[]> {
    try {
      return await this.foodRepository.findFeatured();
    } catch {
      throw new BadRequestException('Failed to retrieve featured food items');
    }
  }

  async updateStatus(id: string, status: FoodStatus): Promise<Food> {
    return this.update(id, { status });
  }

  async toggleFeatured(id: string): Promise<Food> {
    const food = await this.findOne(id);
    return this.update(id, { isFeatured: !food.isFeatured });
  }
}
