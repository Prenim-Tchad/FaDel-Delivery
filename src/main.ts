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
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // CORS pour le développement
  app.enableCors({
    origin: ['http://localhost:3001', 'http://localhost:8080', 'http://localhost:4200'],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3001);
  console.log(`🚀 Application FaDel Delivery démarrée sur: http://localhost:${process.env.PORT ?? 3001}`);
  console.log(`📚 Documentation API disponible sur: http://localhost:${process.env.PORT ?? 3001}/api`);
}
bootstrap();
