import { Module, OnModuleInit } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { LobbyModule } from './lobby/lobby.module';
import { ConfigModule } from '@nestjs/config';
import { MikroORM } from '@mikro-orm/core';
import { RoundModule } from './round/round.module';
import { PlayerModule } from './player/player.module';
import { AuthModule } from './auth/auth.module';
import { SelectedCardsModule } from './selectedCards/selectedCards.module';
import { CoreModule } from './core.module';

@Module({
  imports: [
    MikroOrmModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    LobbyModule,
    RoundModule,
    PlayerModule,
    AuthModule,
    CoreModule,
    SelectedCardsModule,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly orm: MikroORM) {}

  async onModuleInit() {
    const migrator = this.orm.getMigrator();
    const migrations = await migrator.getPendingMigrations();

    if (migrations && migrations.length > 0) {
      await migrator.up();
    }
  }
}
