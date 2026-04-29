import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtAuthService } from './jwt-auth.service';
import { SUPABASE_CLIENT } from './auth.constants';
import { BadRequestException } from '@nestjs/common'; // ✅ UnauthorizedException retiré
import { UserRole } from '../../shared/types';

interface SupabaseMock {
  auth: {
    signUp: jest.Mock;
    signInWithPassword: jest.Mock;
  };
}

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtAuthService;
  let supabaseMock: SupabaseMock; // ✅ typé

  beforeEach(async () => {
    supabaseMock = {
      auth: {
        signUp: jest.fn(),
        signInWithPassword: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: SUPABASE_CLIENT, useValue: supabaseMock },
        {
          provide: JwtAuthService,
          useValue: { generateTokenPair: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtAuthService>(JwtAuthService);
  });

  describe('signUp', () => {
    it('devrait lever une BadRequestException si Supabase retourne une erreur', async () => {
      supabaseMock.auth.signUp.mockResolvedValue({
        data: {},
        error: { message: 'Email existant' },
      });

      const dto = {
        email: 'test@fadel.td',
        password: '123',
        nom: 'T',
        prenom: 'H',
        phone: '1',
        quartier: 'M',
      };

      await expect(service.signUp(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('signInWithJwt', () => {
    it('devrait retourner un profil complet avec isPartner calculé', async () => {
      const mockSupabaseUser = {
        id: 'user_123',
        email: 'chef@resto.td',
        user_metadata: { role: UserRole.PARTNER, nom: 'Resto A' },
      };

      supabaseMock.auth.signInWithPassword.mockResolvedValue({
        data: {
          session: { access_token: 'at', refresh_token: 'rt' },
          user: mockSupabaseUser,
        },
        error: null,
      });

      (jwtService.generateTokenPair as jest.Mock).mockResolvedValue({
        accessToken: 'jwt_at',
        refreshToken: 'jwt_rt',
      });

      const result = await service.signInWithJwt({
        email: 'chef@resto.td',
        password: 'password',
      });

      expect(result.user.isPartner).toBe(true);
      expect(result.accessToken).toBe('jwt_at');
    });
  });
});
