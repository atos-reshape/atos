import { Migration } from '@mikro-orm/migrations';

export class Migration20220327123533 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "player" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "lobby_id" varchar(255) not null);',
    );
    this.addSql(
      'alter table "player" add constraint "player_pkey" primary key ("id");',
    );

    this.addSql(
      'create table "selected_cards" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "round_id" varchar(255) not null, "player_id" varchar(255) not null, "cards" text[] not null);',
    );
    this.addSql(
      'alter table "selected_cards" add constraint "selected_cards_pkey" primary key ("id");',
    );

    this.addSql(
      'alter table "player" add constraint "player_lobby_id_foreign" foreign key ("lobby_id") references "lobby" ("id") on update cascade;',
    );

    this.addSql(
      'alter table "selected_cards" add constraint "selected_cards_round_id_foreign" foreign key ("round_id") references "round" ("id") on update cascade;',
    );
    this.addSql(
      'alter table "selected_cards" add constraint "selected_cards_player_id_foreign" foreign key ("player_id") references "player" ("id") on update cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "selected_cards" drop constraint "selected_cards_player_id_foreign";',
    );

    this.addSql('drop table if exists "player" cascade;');

    this.addSql('drop table if exists "selected_cards" cascade;');
  }
}
