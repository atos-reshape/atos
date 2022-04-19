import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { BaseTranslation } from '../../database/entities/base-translation.entity';
import { Card } from './card.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class CardTranslation extends BaseTranslation {
  @ApiProperty()
  @Property()
  text!: string;

  @ManyToOne(() => Card, {
    hidden: true,
    wrappedReference: true,
    index: true,
  })
  card!: Card;
}
