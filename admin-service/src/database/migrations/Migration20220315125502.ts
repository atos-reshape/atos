import { Migration } from '@mikro-orm/migrations';

export class Migration20220315125502 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "card" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "text" varchar(255) not null);',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "card" cascade;');
  }
}
