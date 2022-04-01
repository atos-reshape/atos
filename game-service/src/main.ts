import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  loadOpenAPI(app);
  app.enableCors();
  // Automatic request body validation
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Automatic response body serializer
  app.useGlobalInterceptors(new ClassSerializerInterceptor(new Reflector()));

  // Ensure gracefully shutdown of plugins (like db connections)
  app.enableShutdownHooks();

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
