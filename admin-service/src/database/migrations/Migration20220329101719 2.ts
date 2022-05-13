import { Migration } from '@mikro-orm/migrations';

export class Migration20220329101719 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "card_set" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "type" varchar(255) not null, "deleted_at" timestamptz(0) null);',
    );
    this.addSql(
      'alter table "card_set" add constraint "card_set_pkey" primary key ("id");',
    );

    this.addSql(
      'create table "card_set_cards" ("card_set_id" varchar(255) not null, "card_id" varchar(255) not null);',
    );
    this.addSql(
      'alter table "card_set_cards" add constraint "card_set_cards_pkey" primary key ("card_set_id", "card_id");',
    );

    this.addSql(
      'alter table "card_set_cards" add constraint "card_set_cards_card_set_id_foreign" foreign key ("card_set_id") references "card_set" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "card_set_cards" add constraint "card_set_cards_card_id_foreign" foreign key ("card_id") references "card" ("id") on update cascade on delete cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "card_set_cards" drop constraint "card_set_cards_card_set_id_foreign";',
    );

    this.addSql('drop table if exists "card_set" cascade;');

    this.addSql('drop table if exists "card_set_cards" cascade;');
  }
}
