import { Migration } from '@mikro-orm/migrations';

export class Migration20220327130702 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "card_set" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "cards" varchar(255) not null, "type" varchar(255) not null, "deleted_at" timestamptz(0) null);',
    );
    this.addSql(
      'alter table "card_set" add constraint "card_set_pkey" primary key ("id");',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "card_set" cascade;');
  }
}
