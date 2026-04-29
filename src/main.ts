import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  // CORS OPTIMISÉ POUR FLUTTER
  app.enableCors({
    // On autorise localhost sur tous les ports pour le développement (Flutter Web change souvent de port)
    origin: (origin, callback) => {
      if (
        !origin ||
        origin.startsWith('http://localhost') ||
        origin.startsWith('http://127.0.0.1')
      ) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Utilise le port 3000 par défaut (car ton Flutter cherche le 3000 dans la capture)
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(
    `🚀 Application FaDel Delivery démarrée sur: http://localhost:${port}`,
  );
  console.log(
    `📚 Documentation API disponible sur: http://localhost:${port}/api`,
  );
}

bootstrap().catch((err) => {
  console.error('❌ Erreur lors du démarrage de FaDel Delivery:', err);
  process.exit(1);
});
