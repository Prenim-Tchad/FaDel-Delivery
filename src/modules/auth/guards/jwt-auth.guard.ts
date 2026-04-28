import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserPayload } from '../../../shared/types/auth.types';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Ajouter une logique personnalisée si nécessaire
    return super.canActivate(context);
  }

  // Remplace ta ligne 16 par celle-ci :
  handleRequest<TUser = any>(err: any, user: any, info: any): TUser {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user; // Ici, 'user' sera casté en TUser automatiquement
  }
}
