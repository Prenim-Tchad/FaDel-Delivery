import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express'; // Import requis pour les assets statiques
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  // On précise le type NestExpressApplication pour accéder à useStaticAssets
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // --- CONFIGURATION POUR LE STOCKAGE LOCAL (Module #24) ---
  // Permet d'accéder aux images via : http://localhost:3001/uploads/food-media/image.jpg
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  // Configuration Swagger
  const config = new DocumentBuilder()
    .setTitle('FaDel Delivery API')
    .setDescription('API de livraison pour FaDel Delivery - Tchad')
    .setVersion('1.0')
    .addTag('auth', 'Authentification et gestion des utilisateurs')
    .addTag('profile', 'Gestion des profils utilisateur')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Entrez le token JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  // Validation globale
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS pour le développement (Adapté aux ports de tes collègues)
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:8080',
      'http://localhost:4200',
    ],
    credentials: true,
  });

  const port = process.env.PORT ?? 3001;
  await app.listen(port);

  console.log(
    `🚀 Application FaDel Delivery démarrée sur: http://localhost:${port}`,
  );
  console.log(
    `📚 Documentation API disponible sur: http://localhost:${port}/api`,
  );
  console.log(`🖼️  Stockage local actif : http://localhost:${port}/uploads/`);
}

bootstrap().catch((err) => {
  console.error('❌ Erreur lors du démarrage de FaDel Delivery:', err);
  process.exit(1);
});
