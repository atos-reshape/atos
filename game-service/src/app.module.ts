import { Module, Logger } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { LobbiesModule } from './lobby/lobby.module';

const logger = new Logger('MikroORM');

@Module({
  imports: [
    MikroOrmModule.forRoot({
      entities: ['./dist/**/*.entity.js'],
      entitiesTs: ['./src/**/*.entity.ts'],
      dbName: 'game-service',
      type: 'postgresql',
      password: "secret",
      user: "root",
      port: 5432,
      debug: true,
      highlighter: new SqlHighlighter(),
      logger: logger.log.bind(logger),
    }),
    LobbiesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
