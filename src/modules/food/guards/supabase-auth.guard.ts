import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseClient, User } from '@supabase/supabase-js';
import { Request } from 'express';
import { SUPABASE_CLIENT } from '../../auth/auth.constants';

type RequestWithUser = Request & {
  user?: User;
};

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(
    @Inject(SUPABASE_CLIENT)
    private readonly supabaseClient: SupabaseClient,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Aucun jeton d’authentification fourni');
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new UnauthorizedException('Format du jeton invalide');
    }

    const token = parts[1];

    try {
      const { data, error } = await this.supabaseClient.auth.getUser(token);

      if (error || !data.user) {
        throw new UnauthorizedException('Session invalide ou expirée');
      }

      request.user = data.user;
      return true;
    } catch {
      throw new UnauthorizedException('Erreur lors de la validation du jeton');
    }
  }
}
