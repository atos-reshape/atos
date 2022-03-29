import { Migration } from '@mikro-orm/migrations';

export class Migration20220319153933 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "round" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "cards" text[] not null, "lobby_id" varchar(255) not null);',
    );
    this.addSql(
      'alter table "round" add constraint "round_pkey" primary key ("id");',
    );

    this.addSql(
      'alter table "round" add constraint "round_lobby_id_foreign" foreign key ("lobby_id") references "lobby" ("id") on update cascade;',
    );

    this.addSql(
      'alter table "lobby" add column "current_round_id" varchar(255) null;',
    );
    this.addSql(
      'alter table "lobby" add constraint "lobby_current_round_id_foreign" foreign key ("current_round_id") references "round" ("id") on update cascade on delete set null;',
    );
    this.addSql(
      'alter table "lobby" add constraint "lobby_current_round_id_unique" unique ("current_round_id");',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "lobby" drop constraint "lobby_current_round_id_foreign";',
    );

    this.addSql('drop table if exists "round" cascade;');

    this.addSql(
      'alter table "lobby" drop constraint "lobby_current_round_id_unique";',
    );
    this.addSql('alter table "lobby" drop column "current_round_id";');
  }
}
