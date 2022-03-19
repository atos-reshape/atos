import {
  Collection,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  Property,
  Unique,
} from '@mikro-orm/core';
import { BaseEntity } from '../database/entities/base-entity.entity';
import { Round } from '../round/round.entity';

function generateGameCode() {
  let text = '';
  const possible = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = 0; i < 8; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

@Entity()
export class Lobby extends BaseEntity {
  @Property()
  @Unique()
  @Index()
  code: string = generateGameCode();

  @Property()
  title!: string;

  @OneToMany({ entity: () => Round, mappedBy: 'lobby', hidden: true })
  rounds = new Collection<Round>(this);

  @OneToOne(() => Round, (round) => round.currentLobby, {
    owner: true,
    nullable: true,
  })
  currentRound?: Round;
}
