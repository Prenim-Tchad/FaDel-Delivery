import { Module } from '@nestjs/common';
import { supabaseClientProvider } from '../auth/auth.constants';
import { AuthModule } from '../auth/auth.module';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
  imports: [AuthModule],
  controllers: [ProfileController],
  providers: [ProfileService, supabaseClientProvider],
  exports: [ProfileService],
})
export class ProfileModule {}
