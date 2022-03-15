import { Migration } from '@mikro-orm/migrations';

export class Migration20220322084857 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "card" drop constraint if exists "card_id_check";',
    );
    this.addSql(
      'alter table "card" alter column "id" type varchar(255) using ("id"::varchar(255));',
    );
    this.addSql('alter table "card" alter column "id" drop default;');
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "card" drop constraint if exists "card_id_check";',
    );
    this.addSql(
      'alter table "card" alter column "id" type int using ("id"::int);',
    );
    this.addSql('create sequence if not exists "card_id_seq";');
    this.addSql(
      'select setval(\'card_id_seq\', (select max("id") from "card"));',
    );
    this.addSql(
      'alter table "card" alter column "id" set default nextval(\'card_id_seq\');',
    );
  }
}
