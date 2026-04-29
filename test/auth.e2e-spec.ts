import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { RedisService } from '../src/modules/redis/redis.service';

const mockRedisService = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  onModuleInit: jest.fn(),
  onModuleDestroy: jest.fn(),
};

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  const testUser = {
    email: `test-${Date.now()}@fadel.td`,
    password: 'Password123!',
    nom: 'Hassane',
    prenom: 'Tomté',
    phone: '23560000000',
    quartier: 'Moursal',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(RedisService)
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

  describe('/auth/register (POST)', () => {
    it('devrait inscrire un nouvel utilisateur', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.user).toHaveProperty('email', testUser.email);
        });
    });

    it("devrait échouer si l'email est déjà utilisé", () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(400);
    });
  });

  describe('/auth/login (POST)', () => {
    it("devrait connecter l'utilisateur et retourner des tokens", () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('accessToken');
          expect(res.body).toHaveProperty('refreshToken');
          expect(res.body.user.role).toBeDefined();
        });
    });

    it('devrait rejeter un mauvais mot de passe', () => {
      return request(app.getHttpServer())
        .post('/auth/login') 
        .send({
          email: testUser.email,
          password: 'wrongpassword',
        })
        .expect(401);
    });
  });
});