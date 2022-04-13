import { BaseEntity } from '../database/entities/base-entity.entity';
import { ArrayType, Entity, Index, ManyToOne, Property } from '@mikro-orm/core';
import { Round } from '../round/round.entity';
import { Player } from './player.entity';

@Entity()
@Index({ properties: ['round', 'player'] })
export class SelectedCards extends BaseEntity {
  @ManyToOne({ entity: () => Round, wrappedReference: true, hidden: true, index: true })
  round!: Round;

  @ManyToOne({ entity: () => Player, wrappedReference: true, hidden: true, index: true })
  player!: Player;

  @Property({ type: ArrayType, nullable: false })
  cards: string[] = [];
}
