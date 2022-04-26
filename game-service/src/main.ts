import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RedisIoAdapter } from './redis.adapter';
import * as fs from 'fs';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('../localhost.key'),
    cert: fs.readFileSync('../localhost.crt'),
  };

  const app = await NestFactory.create(AppModule, { httpsOptions });
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  app.setGlobalPrefix('api');

  loadOpenAPI(app);

  // Automatic request body validation
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Automatic response body serializer
  app.useGlobalInterceptors(new ClassSerializerInterceptor(new Reflector()));

  // Ensure gracefully shutdown of plugins (like db connections)
  app.enableShutdownHooks();

  // CORS for frontend
  app.enableCors();

  // Start the app
  await app.listen(process.env.PORT);
}

function loadOpenAPI(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Game service API')
    .setDescription('This service is responsible for managing games')
    .setVersion('pre-alpha')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
}

bootstrap();
