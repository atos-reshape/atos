import { Entity, Filter, ManyToOne, Property } from '@mikro-orm/core';
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
export class Card extends BaseEntity {
  @Property()
  text!: string;

  @Property({ nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => Tag, { nullable: true })
  tag?: Tag;
}
