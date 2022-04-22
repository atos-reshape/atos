import { BaseEntity } from '../database/entities/base-entity.entity';
import {
  ArrayType,
  Entity,
  Index,
  ManyToOne,
  Property,
  Unique,
} from '@mikro-orm/core';
import { Round } from '../round/round.entity';
import { Player } from '../player/player.entity';

@Entity()
@Index({ properties: ['round', 'player'] })
@Unique({ properties: ['round', 'player'] })
export class SelectedCards extends BaseEntity {
  @ManyToOne({
    entity: () => Round,
    wrappedReference: true,
    serializer: (value) => value.id,
    serializedName: 'roundId',
    index: true,
  })
  round!: Round;

  @ManyToOne({
    entity: () => Player,
    wrappedReference: true,
    serializer: (value) => value.id,
    serializedName: 'playerId',
    index: true,
  })
  player!: Player;

  @Property({ type: ArrayType, nullable: false })
  cards: string[] = [];
}
