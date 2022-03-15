import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { LobbiesModule } from './lobby/lobby.module';

@Module({
  imports: [MikroOrmModule.forRoot(), LobbiesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
