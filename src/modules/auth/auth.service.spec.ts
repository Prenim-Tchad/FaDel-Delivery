import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtAuthService } from './jwt-auth.service';
import { SUPABASE_CLIENT } from './auth.constants';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UserRole } from '../../shared/types';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtAuthService;
  let supabaseMock: any;

  beforeEach(async () => {
    // Simulation du client Supabase
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
      // 1. Simuler le succès de connexion Supabase
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

      // 2. Simuler la génération de tokens
      (jwtService.generateTokenPair as jest.Mock).mockResolvedValue({
        accessToken: 'jwt_at',
        refreshToken: 'jwt_rt',
      });

      const result = await service.signInWithJwt({
        email: 'chef@resto.td',
        password: 'password',
      });

      // 3. Vérifications
      expect(result.user.isPartner).toBe(true); // Vérifie que notre logique isPartner fonctionne
      expect(result.accessToken).toBe('jwt_at');
    });
  });
});
