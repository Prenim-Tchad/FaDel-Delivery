import { Global, Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { CartService } from './cart.service';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [RedisService, CartService, CacheService],
  exports: [RedisService, CartService, CacheService],
})
export class RedisModule {}
