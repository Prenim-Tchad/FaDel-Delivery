import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // ✅ ajout
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ProfileModule } from './modules/profile/profile.module';
import { FoodModule } from './modules/food/food.module';
import { RedisModule } from './modules/redis/redis.module';
import { PrismaService } from './prisma.service';
import { QueueModule } from './modules/queue/queue.module';
import { OrderModule } from './modules/order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // ✅ ConfigService disponible dans tous les modules
      envFilePath: '.env',
    }),
    AuthModule,
    ProfileModule,
    FoodModule,
    RedisModule,
    QueueModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
