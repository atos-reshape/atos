import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MikroORM } from '@mikro-orm/core';
import mikroConfig from './mikro-orm.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Run the migrations automatically.
  const orm = await MikroORM.init(mikroConfig);
  const migrator = orm.getMigrator();
  const migrations = await migrator.getPendingMigrations();

  if (migrations && migrations.length > 0) {
    await migrator.up();
  }

  await app.listen(3000);
}

bootstrap();
