import { Migration } from '@mikro-orm/migrations';

export class Migration20220329074237 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "card_set_cards" ("card_set_id" varchar(255) not null, "card_id" varchar(255) not null);');
    this.addSql('alter table "card_set_cards" add constraint "card_set_cards_pkey" primary key ("card_set_id", "card_id");');

    this.addSql('alter table "card_set_cards" add constraint "card_set_cards_card_set_id_foreign" foreign key ("card_set_id") references "card_set" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "card_set_cards" add constraint "card_set_cards_card_id_foreign" foreign key ("card_id") references "card" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "card_set" drop column "cards";');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "card_set_cards" cascade;');

    this.addSql('alter table "card_set" add column "cards" varchar(255) not null;');
  }

}
