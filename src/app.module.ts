import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ProfileModule } from './modules/profile/profile.module';
import { FoodModule } from './modules/food/food.module';
import { RedisModule } from './modules/redis/redis.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [AuthModule, ProfileModule, FoodModule, RedisModule],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService, // 🆕 Service Prisma centralisé disponible globalement
  ],
  exports: [PrismaService], // 🆕 exporté pour être utilisé dans tous les modules
})
export class AppModule {}