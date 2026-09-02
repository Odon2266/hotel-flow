import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Autoriser le frontend Next.js à communiquer avec le backend
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  // Préfixer toutes les routes par /api
  app.setGlobalPrefix('api');

  // Activer la validation automatique des payloads (DTOs)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`Backend prêt sur : http://localhost:${port}/api`);
}

bootstrap();