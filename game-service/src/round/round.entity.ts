import {
  ArrayType,
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
import { SelectedCards } from '../payer/selectedCards.entity';

@Entity()
export class Round extends BaseEntity {
  @Property({ type: ArrayType, nullable: false })
  cards!: string[];

  @ManyToOne({ entity: () => Lobby, wrappedReference: true })
  lobby!: Lobby;

  @OneToOne(() => Lobby, (lobby) => lobby.currentRound, {
    hidden: true,
    wrappedReference: true,
  })
  currentLobby?: IdentifiedReference<Lobby>;

  @OneToMany({ entity: () => SelectedCards, mappedBy: 'round', hidden: true })
  selectedCards = new Collection<SelectedCards>(this);
}
