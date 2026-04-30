import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
  ];

  await prisma.profile.createMany({ data: owners, skipDuplicates: true });

  const getCategoryId = (name: string) => categories.find((item) => item.name === name)?.id || '';

  const restaurants = [
    {
      name: 'Le Marché du Désert',
      description: 'Cuisine tchadienne traditionnelle avec des épices locales.',
      address: 'Avenue 1, N’Djaména',
      phone: '+235 6620 1111',
      email: 'contact@desertfood.com',
      city: 'N’Djaména',
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
      address: 'Quartier 7, N’Djaména',
      phone: '+235 6620 2222',
      email: 'hello@tablesahel.com',
      city: 'N’Djaména',
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
      address: 'Route de Moursal, N’Djaména',
      phone: '+235 6620 3333',
      email: 'contact@bunduburger.com',
      city: 'N’Djaména',
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
                  ingredients: ['pain', 'galette de légumes', 'salade', 'tomate'],
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
      address: 'Zone commerciale, N’Djaména',
      phone: '+235 6620 4444',
      email: 'hello@restoexpress.com',
      city: 'N’Djaména',
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
      address: 'Rue des Artisans, N’Djaména',
      phone: '+235 6620 5555',
      email: 'bonjour@cuisinemaison.com',
      city: 'N’Djaména',
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
  ];

  for (const restaurant of restaurants) {
    await prisma.restaurant.create({
      data: {
        ...restaurant,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
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
