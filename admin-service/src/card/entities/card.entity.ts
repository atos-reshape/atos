import {
  Collection,
  Entity,
  Filter,
  ManyToOne,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { BaseEntity } from '../../database/entities/base-entity.entity';
import { Tag } from '../../tag/entities/tag.entity';
import { CardTranslation } from './card-translation.entity';

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
  @Property({ nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => Tag, { nullable: true })
  tag?: Tag;

  @OneToMany(() => CardTranslation, (cardTranslation) => cardTranslation.card)
  translations = new Collection<CardTranslation>(this);
}
