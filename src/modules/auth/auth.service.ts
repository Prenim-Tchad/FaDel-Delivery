import {
  Inject,
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseClient, User } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from './auth.constants';
import { JwtAuthService } from './jwt-auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
// import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserRole, UserPayload } from '../../shared/types';

// Interface pour mapper ce que tu as configuré dans ton app Flutter/Web
interface FaDelUserMetadata {
  nom: string;
  prenom: string;
  phone: string;
  quartier: string;
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

    if (error) {
      throw new BadRequestException(error.message);
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
    const { data, error } =
      await this.supabaseClient.auth.admin.getUserById(userId);

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
    const supabaseResult = await this.signIn(dto);
    const metadata = supabaseResult.user
      .user_metadata as unknown as FaDelUserMetadata;
    const userRole = this.getUserRoleFromMetadata(metadata);

    // Ajout de la logique isPartner ici aussi pour la cohérence
    const isPartner = userRole === UserRole.PARTNER;

    const tokenPair = await this.jwtAuthService.generateTokenPair(
      supabaseResult.user.id,
      supabaseResult.user.email!,
      userRole,
      {
        nom: metadata.nom,
        prenom: metadata.prenom,
        phone: metadata.phone,
        quartier: metadata.quartier,
        isPartner: isPartner, // On l'ajoute au payload JWT
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

    const metadata = data.user.user_metadata as unknown as FaDelUserMetadata & {
      role?: string;
    };
    const userRole = this.getUserRoleFromMetadata(metadata);

    // CORRECTION : On utilise "userRole" qui est défini juste au-dessus
    return {
      sub: data.user.id,
      email: data.user.email!,
      role: userRole,
      isPartner: userRole === UserRole.PARTNER,
      nom: metadata.nom,
      prenom: metadata.prenom,
      phone: metadata.phone,
      quartier: metadata.quartier,
    };
  }

  async validateJwtToken(token: string): Promise<UserPayload> {
    return this.jwtAuthService.verifyAccessToken(token);
  }

  async refreshJwtToken(refreshToken: string) {
    return this.jwtAuthService.refreshAccessToken(refreshToken);
  }

  private getUserRoleFromMetadata(
    metadata: FaDelUserMetadata & { role?: string },
  ): UserRole {
    if (metadata.role) {
      return metadata.role as UserRole;
    }
    return UserRole.CUSTOMER; // Par défaut, on considère que c'est un client
  }
}
