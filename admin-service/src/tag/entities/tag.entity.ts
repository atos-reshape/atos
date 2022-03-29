import { Collection, Entity, OneToMany, Property } from '@mikro-orm/core';
import { BaseEntity } from '../../database/entities/base-entity.entity';
import { Card } from '../../card/entities/card.entity';

@Entity()
export class Tag extends BaseEntity {
  @Property()
  name: string;

  @OneToMany(() => Card, (card) => card.tag)
  cards = new Collection<Card>(this);
}
