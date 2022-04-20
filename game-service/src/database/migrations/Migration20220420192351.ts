import { Migration } from '@mikro-orm/migrations';

export class Migration20220420192351 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create index "selected_cards_round_id_index" on "selected_cards" ("round_id");',
    );
    this.addSql(
      'create index "selected_cards_player_id_index" on "selected_cards" ("player_id");',
    );
    this.addSql(
      'create index "selected_cards_round_id_player_id_index" on "selected_cards" ("round_id", "player_id");',
    );
    this.addSql(
      'alter table "selected_cards" add constraint "selected_cards_round_id_player_id_unique" unique ("round_id", "player_id");',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop index "selected_cards_round_id_index";');
    this.addSql('drop index "selected_cards_player_id_index";');
    this.addSql('drop index "selected_cards_round_id_player_id_index";');
    this.addSql(
      'alter table "selected_cards" drop constraint "selected_cards_round_id_player_id_unique";',
    );
  }
}
