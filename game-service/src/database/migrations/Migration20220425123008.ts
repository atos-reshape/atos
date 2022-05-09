import { Migration } from '@mikro-orm/migrations';

export class Migration20220425123008 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "round" add column "selectable_cards" int not null default 5;',
    );
    this.addSql(
      'alter table "round" add constraint round_selectable_cards_check check(selectable_cards > 0);',
    );

    this.addSql(
      'alter table "selected_cards" add column "finished_selecting" timestamptz(0) null;',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "round" drop constraint round_selectable_cards_check;',
    );
    this.addSql('alter table "round" drop column "selectable_cards";');

    this.addSql(
      'alter table "selected_cards" drop column "finished_selecting";',
    );
  }
}
