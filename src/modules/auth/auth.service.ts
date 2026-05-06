import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseClient, User } from '@supabase/supabase-js';
import { UserPayload, UserRole } from '../../shared/types';
import { SUPABASE_CLIENT } from './auth.constants';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthService } from './jwt-auth.service';

// Interface typée pour éviter les erreurs "Unsafe member access"
interface FaDelUserMetadata {
  nom: string;
  prenom: string;
  phone: string;
  quartier: string;
  role?: string;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(SUPABASE_CLIENT)
    private readonly supabaseClient: SupabaseClient,
    private readonly jwtAuthService: JwtAuthService,
  ) {}

  async signUp(dto: RegisterDto) {
    const { email, password, nom, prenom, phone, quartier } = dto;

    const { data, error } = await this.supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: { nom, prenom, phone, quartier },
      },
    });

    if (error || !data.user) {
      throw new BadRequestException(
        error?.message || "Erreur lors de l'inscription",
      );
    }

    return {
      message:
        'Inscription réussie. Vérifiez votre email pour confirmer votre compte.',
      user: data.user,
    };
  }

  async signIn(dto: LoginDto) {
    const { email, password } = dto;
    const { data, error } = await this.supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user || !data.session) {
      throw new UnauthorizedException(
        error?.message || 'Identifiants invalides',
      );
    }

    return {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresAt: data.session.expires_at,
      user: data.user,
    };
  }

  async validateToken(token: string): Promise<User> {
    const { data, error } = await this.supabaseClient.auth.getUser(token);

    if (error || !data.user) {
      throw new UnauthorizedException('Token invalide ou expiré.');
    }

    return data.user;
  }

  async getProfile(userId: string) {
    const { data, error } =
      await this.supabaseClient.auth.admin.getUserById(userId);

    if (error || !data.user) {
      throw new BadRequestException('Impossible de récupérer le profil.');
    }

    return {
      id: data.user.id,
      email: data.user.email,
      user_metadata: data.user.user_metadata as FaDelUserMetadata,
      confirmedAt: data.user.confirmed_at,
    };
  }

  async refreshToken(refreshToken: string) {
    const { data, error } = await this.supabaseClient.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error || !data.session || !data.user) {
      throw new UnauthorizedException('Impossible de rafraîchir le token.');
    }

    return {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresAt: data.session.expires_at,
      user: data.user,
    };
  }

  async signOut(accessToken: string) {
    // Utilisation de la méthode globale signOut si possible, ou admin
    const { error } = await this.supabaseClient.auth.admin.signOut(accessToken);

    if (error) {
      throw new BadRequestException('Erreur lors de la déconnexion.');
    }

    return { message: 'Déconnexion réussie.' };
  }

  // Méthodes JWT RS256
  async signInWithJwt(dto: LoginDto) {
    const supabaseResult = await this.signIn(dto);

    // Cast sécurisé des métadonnées pour satisfaire ESLint
    const metadata = (supabaseResult.user.user_metadata ||
      {}) as FaDelUserMetadata;
    const userRole = this.getUserRoleFromMetadata(metadata);
    const isPartner = userRole === UserRole.PARTNER;

    const tokenPair = await this.jwtAuthService.generateTokenPair(
      supabaseResult.user.id,
      supabaseResult.user.email || '',
      userRole,
      {
        nom: metadata.nom || '',
        prenom: metadata.prenom || '',
        phone: metadata.phone || '',
        quartier: metadata.quartier || '',
        isPartner: isPartner,
      },
    );

    return {
      ...tokenPair,
      user: {
        id: supabaseResult.user.id,
        email: supabaseResult.user.email,
        role: userRole,
        isPartner: isPartner,
        nom: metadata.nom,
        prenom: metadata.prenom,
        phone: metadata.phone,
        quartier: metadata.quartier,
      },
    };
  }

  async validateUser(userId: string): Promise<UserPayload | null> {
    const { data, error } =
      await this.supabaseClient.auth.admin.getUserById(userId);

    if (error || !data.user) {
      return null;
    }

    const metadata = (data.user.user_metadata || {}) as FaDelUserMetadata;
    const userRole = this.getUserRoleFromMetadata(metadata);

    return {
      sub: data.user.id,
      email: data.user.email || '',
      role: userRole,
      isPartner: userRole === UserRole.PARTNER,
      nom: metadata.nom || '',
      prenom: metadata.prenom || '',
      phone: metadata.phone || '',
      quartier: metadata.quartier || '',
    };
  }

  async validateJwtToken(token: string): Promise<UserPayload> {
    return this.jwtAuthService.verifyAccessToken(token);
  }

  async refreshJwtToken(refreshToken: string) {
    return this.jwtAuthService.refreshAccessToken(refreshToken);
  }

  private getUserRoleFromMetadata(metadata: FaDelUserMetadata): UserRole {
    if (
      metadata.role &&
      Object.values(UserRole).includes(metadata.role as UserRole)
    ) {
      return metadata.role as UserRole;
    }
    return UserRole.CUSTOMER;
  }
}
