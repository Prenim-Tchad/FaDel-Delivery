import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { RedisService } from '../src/modules/redis/redis.service';
import { SUPABASE_CLIENT } from '../src/modules/auth/auth.constants';

// ── Mocks ──────────────────────────────────────────────────────────────────
const mockRedisService = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  onModuleInit: jest.fn(),
  onModuleDestroy: jest.fn(),
};

const fakeUser = {
  id: 'uuid-test-123',
  email: 'test@fadel.td',
  user_metadata: {
    nom: 'Hassane',
    prenom: 'Tomté',
    phone: '+23560000000',
    quartier: 'Moursal',
  },
  confirmed_at: new Date().toISOString(),
};

const fakeSession = {
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_at: Math.floor(Date.now() / 1000) + 3600,
};

const mockSupabaseClient = {
  auth: {
    signUp: jest.fn().mockResolvedValue({
      data: { user: fakeUser, session: null },
      error: null,
    }),
    signInWithPassword: jest.fn().mockResolvedValue({
      data: { user: fakeUser, session: fakeSession },
      error: null,
    }),
    signOut: jest.fn().mockResolvedValue({ error: null }),
    refreshSession: jest.fn().mockResolvedValue({
      data: { user: fakeUser, session: fakeSession },
      error: null,
    }),
    getUser: jest.fn().mockResolvedValue({
      data: { user: fakeUser },
      error: null,
    }),
    admin: {
      getUserById: jest.fn().mockResolvedValue({
        data: { user: fakeUser },
        error: null,
      }),
      signOut: jest.fn().mockResolvedValue({ error: null }),
    },
  },
};

// ── Tests ──────────────────────────────────────────────────────────────────
describe('AuthController (e2e)', () => {
  let app: INestApplication;

  const testUser = {
    email: `test-${Date.now()}@fadel.td`,
    password: 'Password123!',
    nom: 'Hassane',
    prenom: 'Tomté',
    phone: '+23560000000',
    quartier: 'Moursal',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(SUPABASE_CLIENT) // ✅ mock Supabase
      .useValue(mockSupabaseClient)
      .overrideProvider(RedisService) // ✅ mock Redis
      .useValue(mockRedisService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // ── Register ─────────────────────────────────────────────────────────────
  describe('/auth/register (POST)', () => {
    it('devrait inscrire un nouvel utilisateur', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('user');
        });
    });

    it('devrait échouer si données invalides (email manquant)', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ ...testUser, email: '' })
        .expect(400);
    });

    it('devrait échouer si Supabase retourne une erreur', () => {
      mockSupabaseClient.auth.signUp.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: { message: 'Email already registered' },
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(400);
    });
  });

  // ── Login ─────────────────────────────────────────────────────────────────
  describe('/auth/login (POST)', () => {
    it("devrait connecter l'utilisateur et retourner des tokens", () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: testUser.email, password: testUser.password })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('accessToken');
          expect(res.body).toHaveProperty('refreshToken');
          expect(res.body).toHaveProperty('expiresAt');
          expect(res.body).toHaveProperty('user');
        });
    });

    it('devrait rejeter si Supabase retourne une erreur auth', () => {
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: { message: 'Invalid login credentials' },
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: testUser.email, password: 'wrongpassword' })
        .expect(401);
    });
  });
});
