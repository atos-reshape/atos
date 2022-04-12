import { Module, OnModuleInit } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MikroORM } from '@mikro-orm/core';
import { CardModule } from './card/card.module';
import { CardSetModule } from './card-set/card-set.module';
import { TagModule } from './tag/tag.module';
import {
  ActiveDirectoryStrategy,
  AppController,
} from './auth/active-directory.strategy';

@Module({
  imports: [MikroOrmModule.forRoot(), CardModule, CardSetModule, TagModule],
  providers: [ActiveDirectoryStrategy],
  controllers: [AppController],
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
