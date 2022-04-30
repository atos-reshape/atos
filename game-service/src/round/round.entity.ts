import {
  ArrayType,
  Check,
  Collection,
  Entity,
  IdentifiedReference,
  ManyToOne,
  OneToMany,
  OneToOne,
  Property,
} from '@mikro-orm/core';
import { BaseEntity } from '../database/entities/base-entity.entity';
import { Lobby } from '../lobby/lobby.entity';
import { SelectedCards } from '../selectedCards/selectedCards.entity';

@Entity()
export class Round extends BaseEntity {
  @Property({ type: ArrayType, nullable: false })
  cards: string[] = [];

  @ManyToOne({ entity: () => Lobby, wrappedReference: true })
  lobby!: Lobby;

  @Property({ nullable: true })
  startedAt?: Date;

  @Property({ nullable: true })
  endedAt?: Date;

  @Property({ columnType: 'int', default: 5 })
  @Check({ expression: 'selectable_cards > 0' })
  selectableCards: number;

  @OneToOne(() => Lobby, (lobby) => lobby.currentRound, {
    hidden: true,
    wrappedReference: true,
  })
  currentLobby?: IdentifiedReference<Lobby>;

  @OneToMany({ entity: () => SelectedCards, mappedBy: 'round', hidden: true })
  selectedCards = new Collection<SelectedCards>(this);

  public hasStarted(): boolean {
    return !!this.startedAt;
  }

  public hasEnded(): boolean {
    return !!this.endedAt;
  }

  public isActive(): boolean {
    return this.hasStarted() && !this.hasEnded();
  }
}
