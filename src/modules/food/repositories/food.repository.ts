import { Injectable } from '@nestjs/common';
import { Food } from '../entities/food.entity';
import { CreateFoodDto } from '../dtos/create-food.dto';
import { UpdateFoodDto } from '../dtos/update-food.dto';
import { FoodFiltersDto } from '../dtos/food-filters.dto';
import { FoodStatus } from '../enums/food.enums';

@Injectable()
export class FoodRepository {
  private foods: Food[] = []; // In-memory storage for demo purposes
  private nextId = 1;

  async create(createFoodDto: CreateFoodDto): Promise<Food> {
    const food: Food = {
      id: this.generateId(),
      ...createFoodDto,
      status: FoodStatus.AVAILABLE,
      isFeatured: createFoodDto.isFeatured || false,
      rating: 0,
      reviewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.foods.push(food);
    return food;
  }

  async findAll(filters: FoodFiltersDto = {}): Promise<{ items: Food[]; total: number; page: number; limit: number }> {
    let filteredFoods = [...this.foods];

    // Apply filters
    if (filters.category) {
      filteredFoods = filteredFoods.filter(food => food.category === filters.category);
    }

    if (filters.type) {
      filteredFoods = filteredFoods.filter(food => food.type === filters.type);
    }

    if (filters.partnerId) {
      filteredFoods = filteredFoods.filter(food => food.partnerId === filters.partnerId);
    }

    if (filters.minPrice !== undefined) {
      filteredFoods = filteredFoods.filter(food => food.price >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      filteredFoods = filteredFoods.filter(food => food.price <= filters.maxPrice!);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredFoods = filteredFoods.filter(food =>
        food.name.toLowerCase().includes(searchTerm) ||
        food.description.toLowerCase().includes(searchTerm) ||
        food.ingredients.some(ingredient => ingredient.toLowerCase().includes(searchTerm))
      );
    }

    if (filters.isFeatured !== undefined) {
      filteredFoods = filteredFoods.filter(food => food.isFeatured === filters.isFeatured);
    }

    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedFoods = filteredFoods.slice(startIndex, endIndex);

    return {
      items: paginatedFoods,
      total: filteredFoods.length,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Food | null> {
    return this.foods.find(food => food.id === id) || null;
  }

  async update(id: string, updateFoodDto: UpdateFoodDto): Promise<Food | null> {
    const foodIndex = this.foods.findIndex(food => food.id === id);
    if (foodIndex === -1) {
      return null;
    }

    const updatedFood = {
      ...this.foods[foodIndex],
      ...updateFoodDto,
      updatedAt: new Date(),
    };

    this.foods[foodIndex] = updatedFood;
    return updatedFood;
  }

  async remove(id: string): Promise<boolean> {
    const foodIndex = this.foods.findIndex(food => food.id === id);
    if (foodIndex === -1) {
      return false;
    }

    this.foods.splice(foodIndex, 1);
    return true;
  }

  async findByPartner(partnerId: string): Promise<Food[]> {
    return this.foods.filter(food => food.partnerId === partnerId);
  }

  async findFeatured(): Promise<Food[]> {
    return this.foods.filter(food => food.isFeatured);
  }

  private generateId(): string {
    return `food_${this.nextId++}_${Date.now()}`;
  }
}