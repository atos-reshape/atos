import { Migration } from '@mikro-orm/migrations';

export class Migration20220322122722 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "card" add column "deleted_at" timestamptz(0) null;',
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "card" drop column "deleted_at";');
  }
}
