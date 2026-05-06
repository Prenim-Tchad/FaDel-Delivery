import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UserRole } from '../../../shared/types/auth.types';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RestaurantRepository } from '../repositories/restaurant.repository';
import { RestaurantOwnerGuard } from './restaurant-owner.guard';

describe('RestaurantOwnerGuard', () => {
  let guard: RestaurantOwnerGuard;
  const mockRepository = {
    findById: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(JwtAuthGuard.prototype, 'canActivate').mockResolvedValue(true);
    guard = new RestaurantOwnerGuard(
      mockRepository as unknown as RestaurantRepository,
    );
  });

  function buildContext(request: Record<string, unknown>): ExecutionContext {
    return {
      switchToHttp: () => ({ getRequest: () => request }),
      getClass: jest.fn(),
      getHandler: jest.fn(),
    } as unknown as ExecutionContext;
  }

  it('should allow restaurant owner to create restaurant with own ownerId', async () => {
    const request = {
      method: 'POST',
      params: {},
      body: {},
      user: {
        sub: 'owner-123',
        email: 'owner@example.com',
        role: UserRole.RESTAURANT_OWNER,
        isPartner: false,
      },
    } as Record<string, unknown>;

    const result = await guard.canActivate(buildContext(request));

    expect(result).toBe(true);
    expect(request.body).toMatchObject({ ownerId: 'owner-123' });
  });

  it('should forbid creating a restaurant for a different owner', async () => {
    const request = {
      method: 'POST',
      params: {},
      body: { ownerId: 'owner-456' },
      user: {
        sub: 'owner-123',
        email: 'owner@example.com',
        role: UserRole.RESTAURANT_OWNER,
        isPartner: false,
      },
    } as Record<string, unknown>;

    await expect(guard.canActivate(buildContext(request))).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('should forbid modification when restaurant belongs to another owner', async () => {
    const request = {
      method: 'PATCH',
      params: { id: 'rest-123' },
      body: {},
      user: {
        sub: 'owner-123',
        email: 'owner@example.com',
        role: UserRole.RESTAURANT_OWNER,
        isPartner: false,
      },
    } as Record<string, unknown>;

    mockRepository.findById.mockResolvedValueOnce({ ownerId: 'owner-456' });

    await expect(guard.canActivate(buildContext(request))).rejects.toThrow(
      ForbiddenException,
    );
    expect(mockRepository.findById).toHaveBeenCalledWith('rest-123');
  });
});
