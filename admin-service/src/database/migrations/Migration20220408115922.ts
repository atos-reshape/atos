import { Migration } from '@mikro-orm/migrations';

export class Migration20220408115922 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "card_translation" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "language" varchar(255) not null, "is_default_language" boolean not null, "text" varchar(255) not null, "card_id" varchar(255) not null);',
    );

    this.addSql(
      'alter table "card_translation" add constraint "card_translation_pkey" primary key ("id");',
    );

    this.addSql(
      'alter table "card_translation" add constraint "card_translation_card_id_foreign" foreign key ("card_id") references "card" ("id") on update cascade;',
    );

    this.addSql('alter table "card" drop column "text";');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "card_translation" cascade;');

    this.addSql(
      'alter table "card" add column "text" varchar not null default null;',
    );
  }
}
