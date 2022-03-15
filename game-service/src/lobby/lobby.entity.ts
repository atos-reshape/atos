import { Entity, Index, Property, Unique } from '@mikro-orm/core';
import { BaseEntity } from '../database/entities/base-entity.entity';

@Entity()
export class Lobby extends BaseEntity {
  @Property()
  @Unique()
  @Index()
  code!: string;

  @Property()
  title!: string;

  @Property()
  cardSetId?: string;
}
