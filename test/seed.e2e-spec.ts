import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

describe('Seed - 10 Restaurants N\'Djaména (e2e)', () => {
  let prisma: PrismaClient;
  let pool: Pool;

  beforeAll(async () => {
    dotenv.config();

    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    const adapter = new PrismaPg(pool);
    prisma = new PrismaClient({ adapter });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

  describe('Restaurant Data Seed', () => {
    it('should have created 10 restaurants', async () => {
      const restaurants = await prisma.restaurant.findMany();
      expect(restaurants.length).toBe(10);
    });

    it('should have restaurants in all 10 required quartiers', async () => {
      const restaurants = await prisma.restaurant.findMany();
      const quartiers = [
        'Sabangali',
        'Amriguébé',
        'Chagoua',
        'Abena',
        'Walia',
        'Toukra',
        'Boutalbagara',
        'Farcha',
        'Koundoul',
        'Bakara',
      ];

      quartiers.forEach((quartier) => {
        const hasRestaurant = restaurants.some((r) =>
          r.address.includes(quartier),
        );
        expect(hasRestaurant).toBe(true);
      });
    });

    it('should have all restaurants in N\'Djaména', async () => {
      const restaurants = await prisma.restaurant.findMany();
      restaurants.forEach((r) => {
        expect(r.city).toMatch(/Djaména|N'D/);
      });
    });

    it('should have valid coordinates for all restaurants', async () => {
      const restaurants = await prisma.restaurant.findMany();
      restaurants.forEach((r) => {
        expect(r.latitude).toBeDefined();
        expect(r.longitude).toBeDefined();
        expect(r.latitude).toBeGreaterThan(0);
        expect(r.longitude).toBeGreaterThan(0);
      });
    });

    it('should have logos and cover images for all restaurants', async () => {
      const restaurants = await prisma.restaurant.findMany();
      restaurants.forEach((r) => {
        expect(r.logoUrl).toBeDefined();
        expect(r.coverImageUrl).toBeDefined();
        expect(r.logoUrl).toMatch(/https:\/\//);
        expect(r.coverImageUrl).toMatch(/https:\/\//);
      });
    });

    it('should have opening hours for all restaurants', async () => {
      const restaurants = await prisma.restaurant.findMany();

      for (const restaurant of restaurants) {
        const hours = await prisma.openingHours.findMany({
          where: { restaurantId: restaurant.id },
        });
        expect(hours.length).toBe(7); // 7 days of the week
      }
    });

    it('should have opening hours for all 7 days', async () => {
      const restaurants = await prisma.restaurant.findMany();
      const firstRestaurant = restaurants[0];

      const hours = await prisma.openingHours.findMany({
        where: { restaurantId: firstRestaurant.id },
      });

      const daysOfWeek = hours.map((h) => h.dayOfWeek).sort();
      expect(daysOfWeek).toEqual([0, 1, 2, 3, 4, 5, 6]);
    });

    it('should have delivery zones for all restaurants', async () => {
      const restaurants = await prisma.restaurant.findMany();

      for (const restaurant of restaurants) {
        const zones = await prisma.deliveryZone.findMany({
          where: { restaurantId: restaurant.id },
        });
        expect(zones.length).toBeGreaterThanOrEqual(2);
      }
    });

    it('should have valid delivery fees and minimum orders', async () => {
      const restaurants = await prisma.restaurant.findMany();

      restaurants.forEach((r) => {
        expect(r.deliveryFee).toBeGreaterThan(0);
        expect(r.minimumOrder).toBeGreaterThan(0);
      });
    });

    it('should have menu categories for all restaurants', async () => {
      const restaurants = await prisma.restaurant.findMany();

      for (const restaurant of restaurants) {
        const categories = await prisma.menuCategory.findMany({
          where: { restaurantId: restaurant.id },
        });
        expect(categories.length).toBeGreaterThan(0);
      }
    });

    it('should have menu items in all restaurants', async () => {
      const restaurants = await prisma.restaurant.findMany();

      for (const restaurant of restaurants) {
        const menuItems = await prisma.menuItem.findMany({
          include: {
            menuCategory: {
              where: { restaurantId: restaurant.id },
            },
          },
        });
        expect(menuItems.length).toBeGreaterThan(0);
      }
    });

    it('should have cuisine categories for all restaurants', async () => {
      const restaurants = await prisma.restaurant.findMany();
      restaurants.forEach((r) => {
        expect(r.cuisineCategoryId).toBeDefined();
      });
    });

    it('should have owners for all restaurants', async () => {
      const restaurants = await prisma.restaurant.findMany();
      restaurants.forEach((r) => {
        expect(r.ownerId).toBeDefined();
      });
    });

    it('should have unique restaurant names', async () => {
      const restaurants = await prisma.restaurant.findMany();
      const names = restaurants.map((r) => r.name);
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(restaurants.length);
    });

    it('should have diverse cuisine types', async () => {
      const restaurants = await prisma.restaurant.findMany({
        include: { cuisineCategory: true },
      });

      const cuisineTypes = new Set(
        restaurants.map((r) => r.cuisineCategory.name),
      );
      expect(cuisineTypes.size).toBeGreaterThan(1);
    });

    it('should have valid email addresses', async () => {
      const restaurants = await prisma.restaurant.findMany();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      restaurants.forEach((r) => {
        if (r.email) {
          expect(r.email).toMatch(emailRegex);
        }
      });
    });

    it('should have valid phone numbers', async () => {
      const restaurants = await prisma.restaurant.findMany();
      const phoneRegex = /^\+235\s?\d{4}\s?\d{4}$/;

      restaurants.forEach((r) => {
        expect(r.phone).toMatch(phoneRegex);
      });
    });

    it('should have properly formatted addresses', async () => {
      const restaurants = await prisma.restaurant.findMany();

      restaurants.forEach((r) => {
        expect(r.address).toBeDefined();
        expect(r.address.length).toBeGreaterThan(10);
      });
    });
  });

  describe('Quartier Distribution', () => {
    it('should have one restaurant per quartier', async () => {
      const restaurants = await prisma.restaurant.findMany();

      const quartiers = {
        Sabangali: false,
        Amriguébé: false,
        Chagoua: false,
        Abena: false,
        Walia: false,
        Toukra: false,
        Boutalbagara: false,
        Farcha: false,
        Koundoul: false,
        Bakara: false,
      };

      restaurants.forEach((r) => {
        for (const [quartier, _] of Object.entries(quartiers)) {
          if (r.address.includes(quartier)) {
            quartiers[quartier] = true;
          }
        }
      });

      Object.values(quartiers).forEach((found) => {
        expect(found).toBe(true);
      });
    });
  });
});
