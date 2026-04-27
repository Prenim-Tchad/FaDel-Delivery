import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SupabaseAuthGuard } from './guards/supabase-auth.guard';
import { supabaseClientProvider } from './auth.constants';

@Module({
  controllers: [AuthController],
  providers: [AuthService, SupabaseAuthGuard, supabaseClientProvider],
  exports: [AuthService],
})
export class AuthModule {}
