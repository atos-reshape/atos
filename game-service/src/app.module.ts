import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { LobbiesModule } from './lobby/lobby.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [MikroOrmModule.forRoot(), ConfigModule.forRoot(), LobbiesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
