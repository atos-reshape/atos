import { Entity, Filter, ManyToMany, Property } from '@mikro-orm/core';
import { Card } from '../../card/entities/card.entity';
import { BaseEntity } from '../../database/entities/base-entity.entity';

@Entity()
@Filter({
  name: 'isActive',
  cond: { deletedAt: null },
  default: true,
})
export class CardSet extends BaseEntity {
  @ManyToMany({ entity: () => Card })
  cards!: Card[];

  @Property()
  type!: string;

  @Property({ nullable: true })
  deletedAt?: Date;
}
