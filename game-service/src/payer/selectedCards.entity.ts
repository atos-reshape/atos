import { BaseEntity } from '../database/entities/base-entity.entity';
import { ArrayType, Entity, ManyToOne, Property } from '@mikro-orm/core';
import { Round } from '../round/round.entity';
import { Player } from './player.entity';

@Entity()
export class SelectedCards extends BaseEntity {
  @ManyToOne({ entity: () => Round, wrappedReference: true, hidden: true })
  round!: Round;

  @ManyToOne({ entity: () => Player, wrappedReference: true, hidden: true })
  player!: Player;

  @Property({ type: ArrayType, nullable: false })
  cards!: string[];
}
