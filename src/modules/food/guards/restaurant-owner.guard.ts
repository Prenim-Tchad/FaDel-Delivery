import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { UserPayload, UserRole } from '../../../shared/types/auth.types';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RestaurantRepository } from '../repositories/restaurant.repository';

interface RestaurantOwnerRequest extends Request {
  user: UserPayload;
  body: Record<string, unknown>;
  params: Record<string, string>;
}

@Injectable()
export class RestaurantOwnerGuard extends JwtAuthGuard {
  constructor(private readonly restaurantRepository: RestaurantRepository) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAuthenticated = await super.canActivate(context);
    if (!isAuthenticated) {
      return false;
    }

    const request = context.switchToHttp().getRequest<RestaurantOwnerRequest>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Utilisateur non authentifié.');
    }

    if (user.role !== UserRole.RESTAURANT_OWNER) {
      throw new ForbiddenException(
        'Accès réservé aux propriétaires de restaurant.',
      );
    }

    const method = request.method;
    const restaurantId = request.params?.id;

    if (method === 'POST' && !restaurantId) {
      if (request.body?.ownerId && request.body.ownerId !== user.sub) {
        throw new ForbiddenException(
          'Vous ne pouvez créer un restaurant que pour votre propre compte.',
        );
      }

      request.body = {
        ...request.body,
        ownerId: user.sub,
      };

      return true;
    }

    if (restaurantId) {
      const restaurant = (await this.restaurantRepository.findById(
        restaurantId,
      )) as { ownerId?: string } | null;

      if (!restaurant || restaurant.ownerId !== user.sub) {
        throw new ForbiddenException(
          'Vous n’êtes pas autorisé à modifier ce restaurant.',
        );
      }

      if (
        method === 'PATCH' &&
        request.body?.ownerId &&
        request.body.ownerId !== user.sub
      ) {
        throw new ForbiddenException(
          'Impossible de modifier le propriétaire du restaurant.',
        );
      }
    }

    return true;
  }
}
