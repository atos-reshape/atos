import { BaseEntity } from '../database/entities/base-entity.entity';
import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { Lobby } from '../lobby/lobby.entity';
import { SelectedCards } from './selectedCards.entity';

@Entity()
export class Player extends BaseEntity {
  @Property()
  name!: string;

  @ManyToOne({ entity: () => Lobby, wrappedReference: true, hidden: true })
  lobby!: Lobby;

  @OneToMany({ entity: () => SelectedCards, mappedBy: 'player', hidden: true })
  selectedCards = new Collection<SelectedCards>(this);
}
