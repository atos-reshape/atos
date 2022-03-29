import { Migration } from '@mikro-orm/migrations';

export class Migration20220315142934 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "lobby" drop constraint if exists "lobby_id_check";',
    );
    this.addSql(
      'alter table "lobby" alter column "id" type varchar(255) using ("id"::varchar(255));',
    );
    this.addSql('alter table "lobby" drop column "card_set_id";');
    this.addSql('alter table "lobby" alter column "id" drop default;');
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "lobby" add column "card_set_id" varchar(255) not null;',
    );
    this.addSql(
      'alter table "lobby" drop constraint if exists "lobby_id_check";',
    );
    this.addSql(
      'alter table "lobby" alter column "id" type int using ("id"::int);',
    );
    this.addSql('create sequence if not exists "lobby_id_seq";');
    this.addSql(
      'select setval(\'lobby_id_seq\', (select max("id") from "lobby"));',
    );
    this.addSql(
      'alter table "lobby" alter column "id" set default nextval(\'lobby_id_seq\');',
    );
  }
}
