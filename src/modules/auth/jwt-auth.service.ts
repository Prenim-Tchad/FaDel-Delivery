import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserPayload, TokenPair, UserRole } from '../../shared/types';

@Injectable()
export class JwtAuthService {
  constructor(private readonly jwtService: JwtService) {}

  async generateTokenPair(
    userId: string,
    email: string,
    role: UserRole,
    additionalData?: any,
  ): Promise<TokenPair> {
    const payload: UserPayload = {
      sub: userId,
      email,
      role,
      ...additionalData,
    };

    const accessToken = await this.jwtService.signAsync(payload as any, {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION || '15m' as any,
      algorithm: 'RS256',
    });

    const refreshToken = await this.jwtService.signAsync(
      { sub: userId } as any,
      {
        expiresIn: (process.env.JWT_REFRESH_TOKEN_EXPIRATION || '7d') as any,
        algorithm: 'RS256',
      },
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: 15 * 60, // 15 minutes en secondes
    };
  }

  async verifyAccessToken(token: string): Promise<UserPayload> {
    try {
      const payload = await this.jwtService.verifyAsync<UserPayload>(token, {
        algorithms: ['RS256'],
      });
      return payload;
    } catch (error) {
      throw new Error('Token invalide ou expiré');
    }
  }

  async verifyRefreshToken(token: string): Promise<{ sub: string }> {
    try {
      const payload = await this.jwtService.verifyAsync<{ sub: string }>(
        token,
        {
          algorithms: ['RS256'],
        },
      );
      return payload;
    } catch (error) {
      throw new Error('Refresh token invalide ou expiré');
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<TokenPair> {
    const payload = await this.verifyRefreshToken(refreshToken);
    // Ici, vous devriez récupérer les informations utilisateur depuis la base de données
    // Pour l'exemple, on utilise des données fictives
    const userData = {
      email: 'user@example.com',
      role: UserRole.CUSTOMER,
    };

    return this.generateTokenPair(payload.sub, userData.email, userData.role);
  }
}
