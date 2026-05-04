import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ProfileModule } from './modules/profile/profile.module';
import { FoodModule } from './modules/food/food.module';
import { RedisModule } from './modules/redis/redis.module';
<<<<<<< HEAD
import { DeliveryModule } from './modules/delivery/delivery.module';
=======
import { PrismaService } from './prisma.service';
>>>>>>> ebec9c1f957e06ace8ff134540545740bff8dca3

@Module({
  imports: [AuthModule, ProfileModule, FoodModule, RedisModule, DeliveryModule],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService, // 🆕 Service Prisma centralisé disponible globalement
  ],
  exports: [PrismaService], // 🆕 exporté pour être utilisé dans tous les modules
})
export class AppModule {}