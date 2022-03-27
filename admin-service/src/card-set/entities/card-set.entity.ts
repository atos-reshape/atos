import { Collection, Entity, ManyToMany, Property } from '@mikro-orm/core';
import { Card } from '../../card/entities/card.entity';
import { BaseEntity } from '../../database/entities/base-entity.entity';

@Entity()
export class CardSet extends BaseEntity {
  @ManyToMany({ entity: () => Card })
  cards!: Collection<Card>;

  @Property()
  type!: string;

  @Property({ nullable: true })
  deletedAt?: Date;
}
