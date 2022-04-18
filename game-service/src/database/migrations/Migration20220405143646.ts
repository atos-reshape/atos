import { Migration } from '@mikro-orm/migrations';

export class Migration20220405143646 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "round" add column "started_at" timestamptz(0) null, add column "ended_at" timestamptz(0) null;',
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "round" drop column "started_at";');
    this.addSql('alter table "round" drop column "ended_at";');
  }
}
