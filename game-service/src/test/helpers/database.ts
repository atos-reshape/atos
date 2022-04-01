import { MikroOrmModule } from '@mikro-orm/nestjs';
import config from '../../mikro-orm.config';

export const UseDatabaseTestConfig = () =>
  MikroOrmModule.forRoot({
    ...config,
    dbName: process.env.DB_NAME_TEST,
    password: process.env.DB_PASSWORD,
    user: process.env.DB_USER,
  });
