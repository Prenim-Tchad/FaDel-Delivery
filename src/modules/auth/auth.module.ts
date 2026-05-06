import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { supabaseClientProvider } from './auth.constants';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { SupabaseAuthGuard } from './guards/supabase-auth.guard';
import { JwtAuthService } from './jwt-auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      publicKey: process.env.JWT_PUBLIC_KEY,
      privateKey: process.env.JWT_PRIVATE_KEY,
      signOptions: {
        algorithm: 'RS256',
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION || '15m',
      },
    } as JwtModuleOptions), // CORRECTION : Utilise le type officiel au lieu de any
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAuthService,
    SupabaseAuthGuard,
    JwtAuthGuard,
    RolesGuard,
    JwtStrategy,
    supabaseClientProvider,
  ],
  exports: [
    AuthService,
    JwtAuthService,
    SupabaseAuthGuard,
    JwtAuthGuard,
    RolesGuard,
  ],
})
export class AuthModule {}
