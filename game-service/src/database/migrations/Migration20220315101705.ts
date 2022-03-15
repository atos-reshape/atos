import { Migration } from '@mikro-orm/migrations';

export class Migration20220315101705 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "lobby" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "code" varchar(255) not null, "title" varchar(255) not null, "card_set_id" varchar(255) not null);',
    );
    this.addSql('create index "lobby_code_index" on "lobby" ("code");');
    this.addSql(
      'alter table "lobby" add constraint "lobby_code_unique" unique ("code");',
    );
  }
}
