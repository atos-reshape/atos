import { Entity, Filter, Property } from '@mikro-orm/core';
import { BaseEntity } from '../../database/entities/base-entity.entity';

@Entity()
@Filter({
  name: 'isActive',
  cond: { deletedAt: null },
  default: true,
})
export class Card extends BaseEntity {
  @Property()
  text!: string;

  @Property({ nullable: true })
  deletedAt?: Date;
}
