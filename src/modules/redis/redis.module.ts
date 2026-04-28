import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { CartService } from './cart.service';
import { CacheService } from './cache.service';

@Global()
@Module({
  providers: [RedisService, CartService, CacheService],
  exports: [RedisService, CartService, CacheService],
})
export class RedisModule {}
