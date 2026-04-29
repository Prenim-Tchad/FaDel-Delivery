import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
//import { UserPayload } from '../../../shared/types';
import { Request } from 'express';
interface AuthRequest extends Request {
  user?: any; // On permet l'assignation temporaire ou on utilise UserPayload
}

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // CORRECTION : On type la requête dès le départ
    const request = context.switchToHttp().getRequest<AuthRequest>();
    // CORRECTION : L'accès aux headers est maintenant sécurisé par le type Request
    const authorization = request.headers.authorization;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token manquant.');
    }

    const token = authorization.replace('Bearer ', '').trim();
    if (!token) {
      throw new UnauthorizedException('Token invalide.');
    }

    try {
      const user = await this.authService.validateToken(token);
      // CORRECTION : L'assignation est sûre car AuthRequest autorise .user
      request.user = user;
      return true;
    } catch {
      throw new UnauthorizedException('Session expirée ou invalide.');
    }
  }
}
