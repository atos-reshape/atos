import { Migration } from '@mikro-orm/migrations';

export class Migration20220513122645 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "tag" add column "description" text not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "tag" drop column "description";');
  }
}
