import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantRepository } from './../repositories/restaurant.repository';
import { PrismaService } from '../../../prisma.service';

describe('RestaurantRepository', () => {
  let repository: RestaurantRepository;
  let prisma: PrismaService;

  const mockPrisma = {
    restaurant: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantRepository,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    repository = module.get<RestaurantRepository>(RestaurantRepository);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a restaurant', async () => {
      const dto = {
        name: 'Saveurs du Tchad',
        address: 'Avenue Mobutu, N’Djaména',
        phone: '+23566000000',
        rccm: 'RCCM-TD-2026-B-1234',
        cuisineCategoryId: 'cat-123',
        ownerId: 'user-456'
      };

      mockPrisma.restaurant.create.mockResolvedValue({ id: '1', ...dto });

      const result = await repository.create(dto as any);

      expect(result).toHaveProperty('id');
      expect(mockPrisma.restaurant.create).toHaveBeenCalled();
    });
  });
});