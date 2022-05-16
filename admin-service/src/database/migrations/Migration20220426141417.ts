import { Migration } from '@mikro-orm/migrations';

export class Migration20220426141417 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "set" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "deleted_at" timestamptz(0) null, "tag_id" varchar(255) null);',
    );
    this.addSql(
      'alter table "set" add constraint "set_pkey" primary key ("id");',
    );

    this.addSql(
      'create table "set_cards" ("set_id" varchar(255) not null, "card_id" varchar(255) not null);',
    );
    this.addSql(
      'alter table "set_cards" add constraint "set_cards_pkey" primary key ("set_id", "card_id");',
    );

    this.addSql(
      'alter table "set" add constraint "set_tag_id_foreign" foreign key ("tag_id") references "tag" ("id") on update cascade on delete set null;',
    );

    this.addSql(
      'alter table "set_cards" add constraint "set_cards_set_id_foreign" foreign key ("set_id") references "set" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "set_cards" add constraint "set_cards_card_id_foreign" foreign key ("card_id") references "card" ("id") on update cascade on delete cascade;',
    );

    this.addSql(
      'create index "card_translation_card_id_index" on "card_translation" ("card_id");',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "set_cards" drop constraint "set_cards_set_id_foreign";',
    );

    this.addSql('drop table if exists "set" cascade;');

    this.addSql('drop table if exists "set_cards" cascade;');

    this.addSql('drop index "card_translation_card_id_index";');
  }
}
