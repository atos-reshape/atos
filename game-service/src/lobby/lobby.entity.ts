import { Entity, Index, Property, Unique } from '@mikro-orm/core';
import { BaseEntity } from '../database/entities/base-entity.entity';

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
}
