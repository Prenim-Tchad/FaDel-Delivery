import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { TokenPair, UserPayload, UserRole } from '../../shared/types';

@Injectable()
export class JwtAuthService {
  constructor(private readonly jwtService: JwtService) {}

  async generateTokenPair(
    userId: string,
    email: string,
    role: UserRole,
    additionalData?: Partial<UserPayload>, // Typage plus précis ici
  ): Promise<TokenPair> {
    // CORRECTION : On s'assure que isPartner est toujours défini
    // On le calcule à partir du rôle ou on le récupère des données additionnelles
    const isPartner = additionalData?.isPartner ?? role === UserRole.PARTNER;

    const payload: UserPayload = {
      sub: userId,
      email,
      role,
      nom: additionalData?.nom || '',
      prenom: additionalData?.prenom || '',
      phone: additionalData?.phone || '',
      quartier: additionalData?.quartier || '',
      isPartner: isPartner, // Obligatoire maintenant dans UserPayload
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION || '15m',
      algorithm: 'RS256',
    } as JwtSignOptions);

    const refreshToken = await this.jwtService.signAsync({ sub: userId }, {
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION || '7d',
      algorithm: 'RS256',
    } as JwtSignOptions);

    return {
      accessToken,
      refreshToken,
      expiresIn: 15 * 60,
    };
  }

  async verifyAccessToken(token: string): Promise<UserPayload> {
    try {
      const payload = await this.jwtService.verifyAsync<UserPayload>(token, {
        algorithms: ['RS256'],
      });
      // Sécurité : on garantit que isPartner est un booléen en sortie
      return {
        ...payload,
        isPartner: !!payload.isPartner,
      };
    } catch {
      throw new Error('Token invalide ou expiré');
    }
  }

  async verifyRefreshToken(token: string): Promise<{ sub: string }> {
    try {
      return await this.jwtService.verifyAsync<{ sub: string }>(token, {
        algorithms: ['RS256'],
      });
    } catch {
      throw new Error('Refresh token invalide ou expiré');
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<TokenPair> {
    const payload = await this.verifyRefreshToken(refreshToken);
    // TODO: À terme, récupérer les vraies infos depuis Prisma pour N'Djamena
    const userData = {
      email: 'user@example.com',
      role: UserRole.CUSTOMER,
      isPartner: false,
    };

    return this.generateTokenPair(payload.sub, userData.email, userData.role, {
      isPartner: userData.isPartner,
    });
  }
}
