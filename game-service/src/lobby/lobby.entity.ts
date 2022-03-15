import { Entity, Index, PrimaryKey, Property, Unique } from '@mikro-orm/core';

@Entity()
export class Lobby {
  // name?: means nullable

  @PrimaryKey()
  id!: string;

  @Property()
  @Unique()
  @Index()
  code!: string;

  @Property()
  title!: string;

  @Property()
  cardSetId?: string;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
