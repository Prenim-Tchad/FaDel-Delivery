import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ProfileModule } from './modules/profile/profile.module';
import { FoodModule } from './modules/food/food.module';

@Module({
  imports: [AuthModule, ProfileModule, FoodModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
