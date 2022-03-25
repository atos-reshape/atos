import { MikroOrmModule } from '@mikro-orm/nestjs';
import config from '../../src/mikro-orm.config';

export const useDatabaseTestConfig = () =>
  MikroOrmModule.forRoot({
    ...config,
    dbName: process.env.DB_NAME_TEST,
  });
