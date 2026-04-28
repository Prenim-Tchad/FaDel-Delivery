import {
  Injectable,
  ExecutionContext,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SupabaseAuthGuard } from '../../auth/guards/supabase-auth.guard';
import { AuthService } from '../../auth/auth.service';
import { UserPayload } from '../../../shared/types/auth.types';

@Injectable()
export class FoodPartnerGuard extends SupabaseAuthGuard {
  constructor(
    @Inject(AuthService) authService: AuthService,
    private reflector: Reflector,
  ) {
    super(authService);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // First check if user is authenticated
    const isAuthenticated = await super.canActivate(context);
    if (!isAuthenticated) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const user = (request as any).user as UserPayload;

    // Check if user is a partner
    if (!(user as any)?.isPartner) {
      throw new ForbiddenException('Only partners can perform this action');
    }

    // For create/update operations, check if the partner owns the food item
    const method = (request as any).method as string;
    const foodId = (request as any).params as any;

    if (method === 'POST' || (method === 'PATCH' && foodId)) {
      // For food creation, the partnerId should match the user's ID
      // For food updates, we need to check ownership (this would require database lookup)
      // For now, we'll allow partners to create/update their own items
      // In a real implementation, you'd check against the database
    }

    return true;
  }
}
