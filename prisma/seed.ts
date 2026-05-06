import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seed start');

  await prisma.orderItemOption.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.foodOrder.deleteMany();
  await prisma.review.deleteMany();
  await prisma.tableReservation.deleteMany();
  await prisma.promoCode.deleteMany();
  await prisma.menuModifierOption.deleteMany();
  await prisma.menuModifierGroup.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.menuCategory.deleteMany();
  await prisma.deliveryZone.deleteMany();
  await prisma.openingHours.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.cuisineCategory.deleteMany();

  const cuisineCategories = await prisma.cuisineCategory.createMany({
    data: [
      { name: 'Cuisine tchadienne', description: 'Saveurs locales du Tchad' },
      {
        name: 'Cuisine africaine',
        description: 'Plats authentiques du continent',
      },
      { name: 'Fast food', description: 'Rapide, savoureux et accessible' },
      { name: 'Grillades', description: 'Viandes et poissons grillés' },
      { name: 'Cuisine fusion', description: 'Mélange de saveurs internationales' },
    ],
    skipDuplicates: true,
  });

  const categories = await prisma.cuisineCategory.findMany();

  const owners = [
    {
      id: 'f1a9d5f8-8603-4f41-8a9f-1b2c3d4e5f01',
      email: 'owner1@fadel.com',
      fullName: 'Amina Haroun',
      phone: '+235 6500 1234',
      avatarUrl: null,
      isAdmin: false,
      isRider: false,
      isPartner: true,
      isActive: true,
    },
    {
      id: 'f1a9d5f8-8603-4f41-8a9f-1b2c3d4e5f02',
      email: 'owner2@fadel.com',
      fullName: 'Issa Mahamat',
      phone: '+235 6500 2345',
      avatarUrl: null,
      isAdmin: false,
      isRider: false,
      isPartner: true,
      isActive: true,
    },
    {
      id: 'f1a9d5f8-8603-4f41-8a9f-1b2c3d4e5f03',
      email: 'owner3@fadel.com',
      fullName: 'Fatouma Ali',
      phone: '+235 6500 3456',
      avatarUrl: null,
      isAdmin: false,
      isRider: false,
      isPartner: true,
      isActive: true,
    },
    {
      id: 'f1a9d5f8-8603-4f41-8a9f-1b2c3d4e5f04',
      email: 'owner4@fadel.com',
      fullName: 'Abdel Rahim',
      phone: '+235 6500 4567',
      avatarUrl: null,
      isAdmin: false,
      isRider: false,
      isPartner: true,
      isActive: true,
    },
    {
      id: 'f1a9d5f8-8603-4f41-8a9f-1b2c3d4e5f05',
      email: 'owner5@fadel.com',
      fullName: 'Salma Ngar',
      phone: '+235 6500 5678',
      avatarUrl: null,
      isAdmin: false,
      isRider: false,
      isPartner: true,
      isActive: true,
    },
    {
      id: 'f1a9d5f8-8603-4f41-8a9f-1b2c3d4e5f06',
      email: 'owner6@fadel.com',
      fullName: 'Hissène Djamal',
      phone: '+235 6501 6789',
      avatarUrl: null,
      isAdmin: false,
      isRider: false,
      isPartner: true,
      isActive: true,
    },
    {
      id: 'f1a9d5f8-8603-4f41-8a9f-1b2c3d4e5f07',
      email: 'owner7@fadel.com',
      fullName: 'Zara Khamis',
      phone: '+235 6501 7890',
      avatarUrl: null,
      isAdmin: false,
      isRider: false,
      isPartner: true,
      isActive: true,
    },
    {
      id: 'f1a9d5f8-8603-4f41-8a9f-1b2c3d4e5f08',
      email: 'owner8@fadel.com',
      fullName: 'Moussa Ibrahim',
      phone: '+235 6501 8901',
      avatarUrl: null,
      isAdmin: false,
      isRider: false,
      isPartner: true,
      isActive: true,
    },
    {
      id: 'f1a9d5f8-8603-4f41-8a9f-1b2c3d4e5f09',
      email: 'owner9@fadel.com',
      fullName: 'Ndjidda Souleyman',
      phone: '+235 6501 9012',
      avatarUrl: null,
      isAdmin: false,
      isRider: false,
      isPartner: true,
      isActive: true,
    },
    {
      id: 'f1a9d5f8-8603-4f41-8a9f-1b2c3d4e5f10',
      email: 'owner10@fadel.com',
      fullName: 'Fatima Hassan',
      phone: '+235 6502 0123',
      avatarUrl: null,
      isAdmin: false,
      isRider: false,
      isPartner: true,
      isActive: true,
    },
  ];

  await prisma.profile.createMany({ data: owners, skipDuplicates: true });

  const getCategoryId = (name: string) => categories.find((item) => item.name === name)?.id || '';

  // Coordonnées GPS approximatives pour les quartiers de N'Djamena
  const quartiers = {
    'Sabangali': { lat: 12.1334, lon: 15.0572, delivery_fee: 1000, min_order: 5000 },
    'Amriguébé': { lat: 12.1500, lon: 15.0800, delivery_fee: 1200, min_order: 5000 },
    'Chagoua': { lat: 12.1600, lon: 15.0700, delivery_fee: 1000, min_order: 5000 },
    'Abena': { lat: 12.1200, lon: 15.0450, delivery_fee: 1500, min_order: 5000 },
    'Walia': { lat: 12.1450, lon: 15.0650, delivery_fee: 1200, min_order: 5000 },
    'Toukra': { lat: 12.1350, lon: 15.0550, delivery_fee: 1100, min_order: 5000 },
    'Boutalbagara': { lat: 12.1400, lon: 15.0900, delivery_fee: 1300, min_order: 5000 },
    'Farcha': { lat: 12.1700, lon: 15.0600, delivery_fee: 1400, min_order: 5000 },
    'Koundoul': { lat: 12.1250, lon: 15.0800, delivery_fee: 1200, min_order: 5000 },
    'Bakara': { lat: 12.1550, lon: 15.0500, delivery_fee: 1100, min_order: 5000 },
  };

  const restaurants = [
    {
      name: 'Le Marché du Désert',
      description: 'Cuisine tchadienne traditionnelle avec des épices locales.',
      address: `Avenue Principal, Sabangali, N'Djaména`,
      phone: '+235 6620 1111',
      email: 'contact@desertfood.com',
      city: `N'Djaména`,
      latitude: quartiers['Sabangali'].lat,
      longitude: quartiers['Sabangali'].lon,
      deliveryFee: quartiers['Sabangali'].delivery_fee,
      minimumOrder: quartiers['Sabangali'].min_order,
      logoUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop',
      coverImageUrl: 'https://images.unsplash.com/photo-1567098735614-e71b99932e29?w=800&h=400&fit=crop',
      ownerId: owners[0].id,
      cuisineCategoryId: getCategoryId('Cuisine tchadienne'),
      menuCategories: {
        create: [
          {
            name: 'Entrées',
            menuItems: {
              create: [
                {
                  name: 'Salade de mil',
                  description: 'Salade fraîche de mil et légumes croquants.',
                  price: 1800,
                  allergens: ['arachides'],
                  ingredients: ['mil', 'tomates', 'concombre', 'oignons'],
                  menuModifierGroups: {
                    create: [
                      {
                        name: 'Sauce',
                        description: 'Choisissez votre sauce',
                        isRequired: false,
                        minSelections: 0,
                        maxSelections: 1,
                        options: {
                          create: [
                            { name: 'Sauce pimentée', price: 0 },
                            { name: 'Sauce citronnée', price: 0 },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  name: 'Boulette de bœuf',
                  description:'Boulettes savoureuses servies avec sauce tomate.',
                  price: 2200,
                  allergens: ['gluten'],
                  ingredients: ['bœuf', 'épices', 'oignons'],
                  menuModifierGroups: {
                    create: [
                      {
                        name: 'Accompagnement',
                        description: 'Choisissez un accompagnement',
                        isRequired: true,
                        minSelections: 1,
                        maxSelections: 1,
                        options: {
                          create: [
                            { name: 'Riz blanc', price: 0 },
                            { name: 'Frites maison', price: 500 },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            name: 'Plats principaux',
            menuItems: {
              create: [
                {
                  name: 'Dja ou bon',
                  description: 'Ragoût de viande avec légumes et huile de palme.',
                  price: 4500,
                  allergens: [],
                  ingredients: ['viande', 'légumes', 'huile de palme'],
                  menuModifierGroups: {
                    create: [
                      {
                        name: 'Taille',
                        description: 'Taille de portion',
                        isRequired: true,
                        minSelections: 1,
                        maxSelections: 1,
                        options: {
                          create: [
                            { name: 'Portion standard', price: 0 },
                            { name: 'Grande portion', price: 1200 },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      name: 'La Table du Sahel',
      description: 'Saveurs sahéliennes et plats partagés dans une ambiance conviviale.',
      address: `Rue de la Paix, Amriguébé, N'Djaména`,
      phone: '+235 6620 2222',
      email: 'hello@tablesahel.com',
      city: `N'Djaména`,
      latitude: quartiers['Amriguébé'].lat,
      longitude: quartiers['Amriguébé'].lon,
      deliveryFee: quartiers['Amriguébé'].delivery_fee,
      minimumOrder: quartiers['Amriguébé'].min_order,
      logoUrl: 'https://images.unsplash.com/photo-1495566394394-da76053b4d92?w=400&h=400&fit=crop',
      coverImageUrl: 'https://images.unsplash.com/photo-1504224155865-0ce10ce375fa?w=800&h=400&fit=crop',
      ownerId: owners[1].id,
      cuisineCategoryId: getCategoryId('Cuisine africaine'),
      menuCategories: {
        create: [
          {
            name: 'Entrées',
            menuItems: {
              create: [
                {
                  name: 'Accras de poisson',
                  description: 'Beignets légers au poisson épicé.',
                  price: 2100,
                  allergens: ['poisson', 'gluten'],
                  ingredients: ['poisson', 'farine', 'épices'],
                  menuModifierGroups: {
                    create: [
                      {
                        name: 'Sauce',
                        description: 'Avec ou sans sauce',
                        isRequired: false,
                        minSelections: 0,
                        maxSelections: 1,
                        options: {
                          create: [
                            { name: 'Sauce piquante', price: 0 },
                            { name: 'Sauce douce', price: 0 },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            name: 'Plats principaux',
            menuItems: {
              create: [
                {
                  name: 'Mafé de poulet',
                  description: 'Poulet mijoté dans une sauce arachide onctueuse.',
                  price: 4800,
                  allergens: ['arachides'],
                  ingredients: ['poulet', 'arachides', 'tomates'],
                  menuModifierGroups: {
                    create: [
                      {
                        name: 'Accompagnement',
                        description: 'Choisissez votre accompagnement',
                        isRequired: true,
                        minSelections: 1,
                        maxSelections: 1,
                        options: {
                          create: [
                            { name: 'Riz blanc', price: 0 },
                            { name: 'Frites', price: 500 },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  name: 'Brochette de chèvre',
                  description: 'Brochettes grillées servies avec salade fraîche.',
                  price: 3900,
                  allergens: [],
                  ingredients: ['chèvre', 'épices', 'salade'],
                  menuModifierGroups: {
                    create: [
                      {
                        name: 'Poids',
                        description: 'Choix du poids',
                        isRequired: true,
                        minSelections: 1,
                        maxSelections: 1,
                        options: {
                          create: [
                            { name: '200g', price: 0 },
                            { name: '300g', price: 900 },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      name: 'Bundu Burger',
      description: 'Burgers gourmands et frites croustillantes.',
      address: `Rue du Commerce, Chagoua, N'Djaména`,
      phone: '+235 6620 3333',
      email: 'contact@bunduburger.com',
      city: `N'Djaména`,
      latitude: quartiers['Chagoua'].lat,
      longitude: quartiers['Chagoua'].lon,
      deliveryFee: quartiers['Chagoua'].delivery_fee,
      minimumOrder: quartiers['Chagoua'].min_order,
      logoUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop',
      coverImageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=400&fit=crop',
      ownerId: owners[2].id,
      cuisineCategoryId: getCategoryId('Fast food'),
      menuCategories: {
        create: [
          {
            name: 'Burgers',
            menuItems: {
              create: [
                {
                  name: 'Burger classique',
                  description: 'Steak, salade, tomate, cheddar.',
                  price: 3200,
                  allergens: ['gluten', 'lactose'],
                  ingredients: ['pain', 'bœuf', 'salade', 'tomate', 'cheddar'],
                  menuModifierGroups: {
                    create: [
                      {
                        name: 'Ajouts',
                        description: 'Ajoutez des suppléments',
                        isRequired: false,
                        minSelections: 0,
                        maxSelections: 3,
                        options: {
                          create: [
                            { name: 'Bacon', price: 600 },
                            { name: 'Avocat', price: 700 },
                            { name: 'Oignons croustillants', price: 300 },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  name: 'Burger veggie',
                  description: 'Galette de légumes, sauce maison.',
                  price: 3300,
                  allergens: ['gluten'],
                  ingredients: ['pain',
                     'galette de légumes', 'salade', 'tomate'],
                },
              ],
            },
          },
          {
            name: 'Accompagnements',
            menuItems: {
              create: [
                {
                  name: 'Frites maison',
                  description: 'Frites dorées et croustillantes.',
                  price: 1200,
                  allergens: [],
                  ingredients: ['pommes de terre', 'huile'],
                },
                {
                  name: 'Onion rings',
                  description: 'Anneaux d’oignon croustillants.',
                  price: 1400,
                  allergens: ['gluten'],
                  ingredients: ['oignons', 'chapelure'],
                },
              ],
            },
          },
        ],
      },
    },
    {
      name: 'Resto Express',
      description: 'Repas rapides et équilibrés pour tous les jours.',
      address: `Avenue Abena, Abena, N'Djaména`,
      phone: '+235 6620 4444',
      email: 'hello@restoexpress.com',
      city: `N'Djaména`,
      latitude: quartiers['Abena'].lat,
      longitude: quartiers['Abena'].lon,
      deliveryFee: quartiers['Abena'].delivery_fee,
      minimumOrder: quartiers['Abena'].min_order,
      logoUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop',
      coverImageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=400&fit=crop',
      ownerId: owners[3].id,
      cuisineCategoryId: getCategoryId('Fast food'),
      menuCategories: {
        create: [
          {
            name: 'Salades',
            menuItems: {
              create: [
                {
                  name: 'Salade Caesar',
                  description: 'Salade verte, poulet, parmesan.',
                  price: 2800,
                  allergens: ['lactose'],
                  ingredients: ['salade', 'poulet', 'parmesan'],
                },
              ],
            },
          },
          {
            name: 'Plats rapides',
            menuItems: {
              create: [
                {
                  name: 'Wrap poulet',
                  description: 'Wrap garni de poulet et légumes.',
                  price: 2600,
                  allergens: ['gluten'],
                  ingredients: ['tortilla', 'poulet', 'salade', 'sauce'],
                },
                {
                  name: 'Poke bowl',
                  description: 'Riz, poisson mariné et légumes frais.',
                  price: 4000,
                  allergens: ['poisson', 'soja'],
                  ingredients: ['riz', 'thon', 'avocat', 'algues'],
                },
              ],
            },
          },
        ],
      },
    },
    {
      name: 'Cuisine Maison',
      description: 'Plats faits maison inspirés des recettes familiales.',
      address: `Rue des Artisans, Walia, N'Djaména`,
      phone: '+235 6620 5555',
      email: 'bonjour@cuisinemaison.com',
      city: `N'Djaména`,
      latitude: quartiers['Walia'].lat,
      longitude: quartiers['Walia'].lon,
      deliveryFee: quartiers['Walia'].delivery_fee,
      minimumOrder: quartiers['Walia'].min_order,
      logoUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop',
      coverImageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=400&fit=crop',
      ownerId: owners[4].id,
      cuisineCategoryId: getCategoryId('Cuisine africaine'),
      menuCategories: {
        create: [
          {
            name: 'Plats du jour',
            menuItems: {
              create: [
                {
                  name: 'Riz au gras',
                  description: 'Riz mijoté dans une sauce parfumée.',
                  price: 4700,
                  allergens: ['arachides'],
                  ingredients: ['riz', 'poulet', 'légumes'],
                },
                {
                  name: 'Poisson braisé',
                  description: 'Poisson grillé avec sauce épicée.',
                  price: 5200,
                  allergens: ['poisson'],
                  ingredients: ['poisson', 'épices', 'citron'],
                },
              ],
            },
          },
          {
            name: 'Desserts',
            menuItems: {
              create: [
                {
                  name: 'Beignets sucrés',
                  description: 'Beignets moelleux à la cannelle.',
                  price: 1200,
                  allergens: ['gluten'],
                  ingredients: ['farine', 'sucre', 'huile'],
                },
              ],
            },
          },
        ],
      },
    },
    {
      name: 'Grillades de Toukra',
      description: 'Viandes et poissons grillés selon les traditions tchadiennes.',
      address: `Rue Toukra, Toukra, N'Djaména`,
      phone: '+235 6620 6666',
      email: 'grillades.toukra@fadel.com',
      city: `N'Djaména`,
      latitude: quartiers['Toukra'].lat,
      longitude: quartiers['Toukra'].lon,
      deliveryFee: quartiers['Toukra'].delivery_fee,
      minimumOrder: quartiers['Toukra'].min_order,
      logoUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561e1a?w=400&h=400&fit=crop',
      coverImageUrl: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=800&h=400&fit=crop',
      ownerId: owners[5].id,
      cuisineCategoryId: getCategoryId('Grillades'),
      menuCategories: {
        create: [
          {
            name: 'Viandes grillées',
            menuItems: {
              create: [
                {
                  name: 'Brochette de bœuf',
                  description: 'Viande de bœuf tendre grillée avec épices locales.',
                  price: 4200,
                  allergens: [],
                  ingredients: ['bœuf', 'épices', 'oignons'],
                },
                {
                  name: 'Côtes levées',
                  description: 'Côtes juteuses cuites lentement sur les braises.',
                  price: 5500,
                  allergens: [],
                  ingredients: ['viande', 'épices', 'miel'],
                },
              ],
            },
          },
          {
            name: 'Poissons grillés',
            menuItems: {
              create: [
                {
                  name: 'Tilapia entier grillé',
                  description: 'Poisson frais grillé accompagné de citron.',
                  price: 5800,
                  allergens: ['poisson'],
                  ingredients: ['tilapia', 'citron', 'épices'],
                },
              ],
            },
          },
        ],
      },
    },
    {
      name: 'Saveurs de Boutalbagara',
      description: 'Cuisine fusion mêlant tradition africaine et touches modernes.',
      address: `Avenue Boutalbagara, Boutalbagara, N'Djaména`,
      phone: '+235 6620 7777',
      email: 'contact@saveurs-boutalbagara.com',
      city: `N'Djaména`,
      latitude: quartiers['Boutalbagara'].lat,
      longitude: quartiers['Boutalbagara'].lon,
      deliveryFee: quartiers['Boutalbagara'].delivery_fee,
      minimumOrder: quartiers['Boutalbagara'].min_order,
      logoUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
      coverImageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=400&fit=crop',
      ownerId: owners[6].id,
      cuisineCategoryId: getCategoryId('Cuisine fusion'),
      menuCategories: {
        create: [
          {
            name: 'Spécialités',
            menuItems: {
              create: [
                {
                  name: 'Crevettes à l\'ail et gingembre',
                  description: 'Crevettes fraiches sautées avec épices et riz',
                  price: 6200,
                  allergens: ['crustacés'],
                  ingredients: ['crevettes', 'ail', 'gingembre', 'riz'],
                },
                {
                  name: 'Poulet sauce cacahuète modernisée',
                  description: 'Interprétation contemporaine du mafé traditionnel.',
                  price: 4900,
                  allergens: ['arachides'],
                  ingredients: ['poulet', 'cacahuète', 'épices', 'légumes'],
                },
              ],
            },
          },
        ],
      },
    },
    {
      name: 'Farcha Restaurant',
      description: 'Authentique cuisine tchadienne du quartier de Farcha.',
      address: `Rue Farcha, Farcha, N'Djaména`,
      phone: '+235 6620 8888',
      email: 'farcha.restaurant@fadel.com',
      city: `N'Djaména`,
      latitude: quartiers['Farcha'].lat,
      longitude: quartiers['Farcha'].lon,
      deliveryFee: quartiers['Farcha'].delivery_fee,
      minimumOrder: quartiers['Farcha'].min_order,
      logoUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
      coverImageUrl: 'https://images.unsplash.com/photo-1504674900967-7f1fb0f52b11?w=800&h=400&fit=crop',
      ownerId: owners[7].id,
      cuisineCategoryId: getCategoryId('Cuisine tchadienne'),
      menuCategories: {
        create: [
          {
            name: 'Plats traditionnels',
            menuItems: {
              create: [
                {
                  name: 'Arachide traditionnel',
                  description: 'Légume à sauce arachide avec viande.',
                  price: 4100,
                  allergens: ['arachides'],
                  ingredients: ['légume', 'arachide', 'viande', 'épices'],
                },
                {
                  name: 'Riz gras traditionnel',
                  description: 'Riz mijoté avec viande et tomate.',
                  price: 3900,
                  allergens: [],
                  ingredients: ['riz', 'viande', 'tomate', 'oignons'],
                },
              ],
            },
          },
        ],
      },
    },
    {
      name: 'Koundoul Délices',
      description: `Délices culinaires du cœur de N'Djaména.`,
      address: `Rue Principale, Koundoul, N'Djaména`,
      phone: '+235 6620 9999',
      email: 'koundoul.delices@fadel.com',
      city: `N'Djaména`,
      latitude: quartiers['Koundoul'].lat,
      longitude: quartiers['Koundoul'].lon,
      deliveryFee: quartiers['Koundoul'].delivery_fee,
      minimumOrder: quartiers['Koundoul'].min_order,
      logoUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
      coverImageUrl: 'https://images.unsplash.com/photo-1504674900967-7f1fb0f52b11?w=800&h=400&fit=crop',
      ownerId: owners[8].id,
      cuisineCategoryId: getCategoryId('Cuisine africaine'),
      menuCategories: {
        create: [
          {
            name: 'Entrées',
            menuItems: {
              create: [
                {
                  name: 'Samoussa viande',
                  description: 'Samoussa croustillante à la viande hachée.',
                  price: 1500,
                  allergens: ['gluten'],
                  ingredients: ['pâte', 'viande', 'épices'],
                },
              ],
            },
          },
          {
            name: 'Plats du jour',
            menuItems: {
              create: [
                {
                  name: 'Tapioca aux poissons',
                  description: 'Tapioca moelleux avec sauce poisson.',
                  price: 3200,
                  allergens: ['poisson'],
                  ingredients: ['tapioca', 'poisson', 'épices', 'sauce'],
                },
              ],
            },
          },
        ],
      },
    },
    {
      name: 'Bakara Palace',
      description: 'Un palais du goût avec vue sur les saveurs tchadiennes.',
      address: `Boulevard Bakara, Bakara, N'Djaména`,
      phone: '+235 6621 0000',
      email: 'bakara.palace@fadel.com',
      city: `N'Djaména`,
      latitude: quartiers['Bakara'].lat,
      longitude: quartiers['Bakara'].lon,
      deliveryFee: quartiers['Bakara'].delivery_fee,
      minimumOrder: quartiers['Bakara'].min_order,
      logoUrl: 'https://images.unsplash.com/photo-1585521537296-9b37fef4810d?w=400&h=400&fit=crop',
      coverImageUrl: 'https://images.unsplash.com/photo-1567298881186-5a52a3e0b7f9?w=800&h=400&fit=crop',
      ownerId: owners[9].id,
      cuisineCategoryId: getCategoryId('Grillades'),
      menuCategories: {
        create: [
          {
            name: 'Spécialités Bakara',
            menuItems: {
              create: [
                {
                  name: 'Escalope de poulet grillée',
                  description: 'Escalope fine grillée avec assaisonnement secret.',
                  price: 4400,
                  allergens: [],
                  ingredients: ['poulet', 'épices', 'citron'],
                },
                {
                  name: 'Merguez sauce tomate',
                  description: 'Merguez servie avec sauce tomate épicée.',
                  price: 3300,
                  allergens: ['gluten'],
                  ingredients: ['merguez', 'tomate', 'épices'],
                },
              ],
            },
          },
        ],
      },
    },
  ];

  for (const restaurant of restaurants) {
    const createdRestaurant = await prisma.restaurant.create({
      data: {
        ...restaurant,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Créer les horaires d'ouverture (lundi à dimanche)
    const openingHours = [
      { dayOfWeek: 1, openTime: '06:00', closeTime: '23:00', isOpen: true }, // Lundi
      { dayOfWeek: 2, openTime: '06:00', closeTime: '23:00', isOpen: true }, // Mardi
      { dayOfWeek: 3, openTime: '06:00', closeTime: '23:00', isOpen: true }, // Mercredi
      { dayOfWeek: 4, openTime: '06:00', closeTime: '23:00', isOpen: true }, // Jeudi
      { dayOfWeek: 5, openTime: '06:00', closeTime: '00:00', isOpen: true }, // Vendredi
      { dayOfWeek: 6, openTime: '07:00', closeTime: '00:00', isOpen: true }, // Samedi
      { dayOfWeek: 0, openTime: '07:00', closeTime: '22:00', isOpen: true }, // Dimanche
    ];

    for (const hours of openingHours) {
      await prisma.openingHours.create({
        data: {
          restaurantId: createdRestaurant.id,
          ...hours,
        },
      });
    }

    // Créer les zones de livraison pour chaque restaurant
    const deliveryZones = [
      {
        name: 'Zone centrale',
        description: 'Livraison dans le quartier principal',
        deliveryFee: 1000,
        minimumOrder: 5000,
        isActive: true,
      },
      {
        name: 'Zone étendue',
        description: 'Livraison dans les quartiers adjacents',
        deliveryFee: 2000,
        minimumOrder: 8000,
        isActive: true,
      },
    ];

    for (const zone of deliveryZones) {
      await prisma.deliveryZone.create({
        data: {
          restaurantId: createdRestaurant.id,
          ...zone,
        },
      });
    }
  }

  console.log('Seed completed');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
