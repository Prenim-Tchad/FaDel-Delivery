import { Inject, Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { SupabaseClient, User } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from './auth.constants';
import { JwtAuthService } from './jwt-auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserRole, UserPayload } from '../../shared/types';

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

    if (error) {
      throw new BadRequestException(error.message);
    }

    return {
      message: 'Inscription réussie. Vérifiez votre email pour confirmer votre compte.',
      user: data.user,
    };
  }

  async signIn(dto: LoginDto) {
    const { email, password } = dto;
    const { data, error } = await this.supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new UnauthorizedException(error.message);
    }

    if (!data.session) {
      throw new UnauthorizedException('Impossible de créer une session.');
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
    const { data, error } = await this.supabaseClient.auth.admin.getUserById(userId);

    if (error || !data.user) {
      throw new BadRequestException('Impossible de récupérer le profil.');
    }

    return {
      id: data.user.id,
      email: data.user.email,
      user_metadata: data.user.user_metadata,
      confirmedAt: data.user.confirmed_at,
    };
  }

  async refreshToken(refreshToken: string) {
    const { data, error } = await this.supabaseClient.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error || !data.session) {
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
    const { error } = await this.supabaseClient.auth.admin.signOut(accessToken);

    if (error) {
      throw new BadRequestException('Erreur lors de la déconnexion.');
    }

    return { message: 'Déconnexion réussie.' };
  }

  // Méthodes JWT RS256
  async signInWithJwt(dto: LoginDto) {
    // D'abord authentifier avec Supabase
    const supabaseResult = await this.signIn(dto);

    // Générer les tokens JWT
    const userRole = this.getUserRoleFromMetadata(supabaseResult.user.user_metadata);
    const tokenPair = await this.jwtAuthService.generateTokenPair(
      supabaseResult.user.id,
      supabaseResult.user.email!,
      userRole,
      {
        nom: supabaseResult.user.user_metadata?.nom,
        prenom: supabaseResult.user.user_metadata?.prenom,
        phone: supabaseResult.user.user_metadata?.phone,
        quartier: supabaseResult.user.user_metadata?.quartier,
      },
    );

    return {
      ...tokenPair,
      user: {
        id: supabaseResult.user.id,
        email: supabaseResult.user.email,
        role: userRole,
        nom: supabaseResult.user.user_metadata?.nom,
        prenom: supabaseResult.user.user_metadata?.prenom,
        phone: supabaseResult.user.user_metadata?.phone,
        quartier: supabaseResult.user.user_metadata?.quartier,
      },
    };
  }

  async validateUser(userId: string): Promise<any> {
    // Ici, vous devriez récupérer l'utilisateur depuis votre base de données Prisma
    // Pour l'exemple, on simule avec Supabase
    const { data, error } = await this.supabaseClient.auth.admin.getUserById(userId);

    if (error || !data.user) {
      return null;
    }

    return {
      id: data.user.id,
      email: data.user.email,
      role: this.getUserRoleFromMetadata(data.user.user_metadata),
      nom: data.user.user_metadata?.nom,
      prenom: data.user.user_metadata?.prenom,
      phone: data.user.user_metadata?.phone,
      quartier: data.user.user_metadata?.quartier,
    };
  }

  async validateJwtToken(token: string): Promise<UserPayload> {
    return this.jwtAuthService.verifyAccessToken(token);
  }

  async refreshJwtToken(refreshToken: string) {
    return this.jwtAuthService.refreshAccessToken(refreshToken);
  }

  private getUserRoleFromMetadata(metadata: any): UserRole {
    // Logique pour déterminer le rôle depuis les métadonnées
    // Par défaut, tous les utilisateurs sont des clients
    // Vous pouvez étendre cette logique selon vos besoins
    if (metadata?.role) {
      return metadata.role as UserRole;
    }
    return UserRole.CUSTOMER;
  }
}


