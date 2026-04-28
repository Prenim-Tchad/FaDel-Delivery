import { Injectable } from '@nestjs/common';
import { RedisService } from './redis.service';

@Injectable()
export class CacheService {
  constructor(private readonly redisService: RedisService) {}

  private getCacheKey(prefix: string, key: string): string {
    return `${prefix}:${key}`;
  }

  // Cache générique avec TTL
  async set<T>(key: string, data: T, ttlSeconds: number = 300): Promise<void> {
    const cacheKey = this.getCacheKey('cache', key);
    await this.redisService.setJson(cacheKey, data, ttlSeconds);
  }

  async get<T>(key: string): Promise<T | null> {
    const cacheKey = this.getCacheKey('cache', key);
    return this.redisService.getJson<T>(cacheKey);
  }

  async delete(key: string): Promise<void> {
    const cacheKey = this.getCacheKey('cache', key);
    await this.redisService.del(cacheKey);
  }

  async exists(key: string): Promise<boolean> {
    const cacheKey = this.getCacheKey('cache', key);
    const result = await this.redisService.exists(cacheKey);
    return result === 1;
  }

  // Cache pour les restaurants populaires
  async setPopularRestaurants(
    restaurants: any[],
    ttlSeconds: number = 600,
  ): Promise<void> {
    await this.set('popular_restaurants', restaurants, ttlSeconds);
  }

  async getPopularRestaurants(): Promise<any[] | null> {
    return this.get<any[]>('popular_restaurants');
  }

  // Cache pour les menus par restaurant
  async setRestaurantMenu(
    restaurantId: string,
    menu: any,
    ttlSeconds: number = 300,
  ): Promise<void> {
    const key = `restaurant_menu:${restaurantId}`;
    await this.set(key, menu, ttlSeconds);
  }

  async getRestaurantMenu(restaurantId: string): Promise<any | null> {
    const key = `restaurant_menu:${restaurantId}`;
    return this.get<any>(key);
  }

  async invalidateRestaurantMenu(restaurantId: string): Promise<void> {
    const key = `restaurant_menu:${restaurantId}`;
    await this.delete(key);
  }

  // Cache pour les avis de restaurants
  async setRestaurantReviews(
    restaurantId: string,
    reviews: any[],
    ttlSeconds: number = 300,
  ): Promise<void> {
    const key = `restaurant_reviews:${restaurantId}`;
    await this.set(key, reviews, ttlSeconds);
  }

  async getRestaurantReviews(restaurantId: string): Promise<any[] | null> {
    const key = `restaurant_reviews:${restaurantId}`;
    return this.get<any[]>(key);
  }

  // Cache pour les zones de livraison
  async setDeliveryZones(
    restaurantId: string,
    zones: any[],
    ttlSeconds: number = 3600,
  ): Promise<void> {
    const key = `delivery_zones:${restaurantId}`;
    await this.set(key, zones, ttlSeconds);
  }

  async getDeliveryZones(restaurantId: string): Promise<any[] | null> {
    const key = `delivery_zones:${restaurantId}`;
    return this.get<any[]>(key);
  }

  // Cache pour les codes promo valides
  async setValidPromoCodes(
    codes: any[],
    ttlSeconds: number = 1800,
  ): Promise<void> {
    await this.set('valid_promo_codes', codes, ttlSeconds);
  }

  async getValidPromoCodes(): Promise<any[] | null> {
    return this.get<any[]>('valid_promo_codes');
  }

  // Cache pour les statistiques
  async setRestaurantStats(
    restaurantId: string,
    stats: any,
    ttlSeconds: number = 600,
  ): Promise<void> {
    const key = `restaurant_stats:${restaurantId}`;
    await this.set(key, stats, ttlSeconds);
  }

  async getRestaurantStats(restaurantId: string): Promise<any | null> {
    const key = `restaurant_stats:${restaurantId}`;
    return this.get<any>(key);
  }

  // Invalidation massive
  async invalidateRestaurantCache(restaurantId: string): Promise<void> {
    const keys = [
      `restaurant_menu:${restaurantId}`,
      `restaurant_reviews:${restaurantId}`,
      `delivery_zones:${restaurantId}`,
      `restaurant_stats:${restaurantId}`,
    ];

    const pipeline = this.redisService.createPipeline();
    keys.forEach((key) => {
      const cacheKey = this.getCacheKey('cache', key);
      pipeline.del(cacheKey);
    });
    await pipeline.exec();
  }

  async invalidateAllCache(): Promise<void> {
    const keys = await this.redisService.keys('cache:*');
    if (keys.length > 0) {
      await this.redisService.getClient().del(...keys);
    }
  }

  // Cache avec tags pour invalidation groupée
  async setWithTags<T>(
    key: string,
    data: T,
    tags: string[],
    ttlSeconds: number = 300,
  ): Promise<void> {
    // Stocker les données
    await this.set(key, data, ttlSeconds);

    // Ajouter la clé à chaque tag
    const pipeline = this.redisService.createPipeline();
    tags.forEach((tag) => {
      const tagKey = this.getCacheKey('tag', tag);
      pipeline.sadd(tagKey, key);
      pipeline.expire(tagKey, ttlSeconds);
    });
    await pipeline.exec();
  }

  async invalidateByTag(tag: string): Promise<void> {
    const tagKey = this.getCacheKey('tag', tag);
    const keys = await this.redisService.smembers(tagKey);

    if (keys.length > 0) {
      const pipeline = this.redisService.createPipeline();
      keys.forEach((key) => {
        const cacheKey = this.getCacheKey('cache', key);
        pipeline.del(cacheKey);
      });
      pipeline.del(tagKey);
      await pipeline.exec();
    }
  }

  // Métriques de cache
  async getCacheStats(): Promise<any> {
    const keys = await this.redisService.keys('cache:*');
    const tagKeys = await this.redisService.keys('tag:*');

    return {
      totalCachedItems: keys.length,
      totalTags: tagKeys.length,
      cacheSize: await this.redisService.getClient().dbsize(),
    };
  }
}
