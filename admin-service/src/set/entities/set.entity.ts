import {
  Collection,
  Entity,
  Filter,
  ManyToMany,
  ManyToOne,
  Property,
} from '@mikro-orm/core';
import { Card } from '../../card/entities/card.entity';
import { BaseEntity } from '../../database/entities/base-entity.entity';
import { Tag } from '../../tag/entities/tag.entity';

@Entity()
@Filter({
  name: 'isActive',
  cond: { deletedAt: null },
  default: true,
})
@Filter({
  name: 'hasTag',
  cond: (args) => ({ tag: { name: args.name } }),
})
export class Set extends BaseEntity {
  @Property()
  name: string;

  @Property({ nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => Tag, { nullable: true })
  tag?: Tag;

  @ManyToMany(() => Card)
  cards = new Collection<Card>(this);
}
