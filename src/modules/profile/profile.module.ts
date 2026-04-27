import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { supabaseClientProvider } from '../auth/auth.constants';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, supabaseClientProvider],
  exports: [ProfileService],
})
export class ProfileModule {}
