import { Migration } from '@mikro-orm/migrations';

export class Migration20220329092231 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "tag" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null);');
    this.addSql('alter table "tag" add constraint "tag_pkey" primary key ("id");');

    this.addSql('alter table "card" add column "tag_id" varchar(255) null;');
    this.addSql('alter table "card" add constraint "card_tag_id_foreign" foreign key ("tag_id") references "tag" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "card" drop constraint "card_tag_id_foreign";');

    this.addSql('drop table if exists "tag" cascade;');

    this.addSql('alter table "card" drop column "tag_id";');
  }

}
