import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthService } from './jwt-auth.service';
import { SupabaseAuthGuard } from './guards/supabase-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
import { supabaseClientProvider } from './auth.constants';

@@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      publicKey: process.env.JWT_PUBLIC_KEY,
      privateKey: process.env.JWT_PRIVATE_KEY,
      signOptions: {
        algorithm: 'RS256',
        // Utilisation d'une assertion pour éviter l'erreur TS2322
        expiresIn: (process.env.JWT_ACCESS_TOKEN_EXPIRATION || '15m') as any, 
      },
    }),
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
  exports: [AuthService, JwtAuthService, SupabaseAuthGuard, JwtAuthGuard, RolesGuard],
})
export class AuthModule {}