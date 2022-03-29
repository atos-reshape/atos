import { Migration } from '@mikro-orm/migrations';

export class Migration20220329122026 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "tag" add column "deleted_at" timestamptz(0) null;',
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "tag" drop column "deleted_at";');
  }
}
