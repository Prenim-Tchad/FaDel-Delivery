import {
  Injectable,
  ExecutionContext,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express'; // Import impératif
import { SupabaseAuthGuard } from '../../auth/guards/supabase-auth.guard';
import { AuthService } from '../../auth/auth.service';
import { UserPayload } from '../../../shared/types/auth.types';

// On définit une interface locale pour typer la requête
interface AuthenticatedRequest extends Request {
  user: UserPayload;
}

@Injectable()
export class FoodPartnerGuard extends SupabaseAuthGuard {
  constructor(
    @Inject(AuthService) authService: AuthService,
    private reflector: Reflector,
  ) {
    super(authService);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Vérification de l'authentification (via le parent)
    const isAuthenticated = await super.canActivate(context);
    if (!isAuthenticated) {
      return false;
    }

    // 2. Typage explicite de la requête pour supprimer les erreurs ESLint
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    // 3. Vérification sécurisée du statut de partenaire
    // Note : On n'utilise plus "as any", TypeScript reconnaît .isPartner grâce à UserPayload
    if (!user?.isPartner) {
      throw new ForbiddenException('Only partners can perform this action');
    }

    // 4. Extraction sécurisée des métadonnées de la requête
    const method = request.method;
    const params = request.params; // L'accès à .params est maintenant sûr

    if (method === 'POST' || (method === 'PATCH' && params.id)) {
      // Logique de vérification de propriété pour FaDel-1
      // À implémenter avec un service de base de données plus tard
    }

    return true;
  }
}
