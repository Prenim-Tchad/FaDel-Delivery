import { Inject, Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { SupabaseClient, User } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from './auth.constants';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(SUPABASE_CLIENT)
    private readonly supabaseClient: SupabaseClient,
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


