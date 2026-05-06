import { Injectable } from '@nestjs/common';
import { CreateFoodDto } from '../dtos/create-food.dto';
import { FoodFiltersDto } from '../dtos/food-filters.dto';
import { UpdateFoodDto } from '../dtos/update-food.dto';
import { Food } from '../entities/food.entity';
import { FoodStatus } from '../enums/food.enums';

@Injectable()
export class FoodRepository {
  private foods: Food[] = []; // In-memory storage for demo purposes
  private nextId = 1;

  async create(createFoodDto: CreateFoodDto): Promise<Food> {
    // Simule une opération asynchrone
    await Promise.resolve();

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

  async findAll(filters: FoodFiltersDto = {}): Promise<{
    items: Food[];
    total: number;
    page: number;
    limit: number;
  }> {
    // Simule l'attente de la base de données
    await Promise.resolve();

    let filteredFoods = [...this.foods];

    // Application des filtres
    if (filters.category) {
      filteredFoods = filteredFoods.filter(
        (food) => food.category === filters.category,
      );
    }

    if (filters.type) {
      filteredFoods = filteredFoods.filter(
        (food) => food.type === filters.type,
      );
    }

    if (filters.partnerId) {
      filteredFoods = filteredFoods.filter(
        (food) => food.partnerId === filters.partnerId,
      );
    }

    if (filters.minPrice !== undefined) {
      filteredFoods = filteredFoods.filter(
        (food) => food.price >= (filters.minPrice ?? 0),
      );
    }

    if (filters.maxPrice !== undefined) {
      filteredFoods = filteredFoods.filter(
        (food) => food.price <= (filters.maxPrice ?? Infinity),
      );
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredFoods = filteredFoods.filter(
        (food) =>
          food.name.toLowerCase().includes(searchTerm) ||
          food.description.toLowerCase().includes(searchTerm) ||
          food.ingredients.some((ingredient) =>
            ingredient.toLowerCase().includes(searchTerm),
          ),
      );
    }

    if (filters.isFeatured !== undefined) {
      filteredFoods = filteredFoods.filter(
        (food) => food.isFeatured === filters.isFeatured,
      );
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
    await Promise.resolve();
    return this.foods.find((food) => food.id === id) || null;
  }

  async update(id: string, updateFoodDto: UpdateFoodDto): Promise<Food | null> {
    await Promise.resolve();
    const foodIndex = this.foods.findIndex((food) => food.id === id);
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
    await Promise.resolve();
    const foodIndex = this.foods.findIndex((food) => food.id === id);
    if (foodIndex === -1) {
      return false;
    }

    this.foods.splice(foodIndex, 1);
    return true;
  }

  async findByPartner(partnerId: string): Promise<Food[]> {
    await Promise.resolve();
    return this.foods.filter((food) => food.partnerId === partnerId);
  }

  async findFeatured(): Promise<Food[]> {
    await Promise.resolve();
    return this.foods.filter((food) => food.isFeatured);
  }

  private generateId(): string {
    return `food_${this.nextId++}_${Date.now()}`;
  }
}
