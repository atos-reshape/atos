import { Collection } from '@mikro-orm/core';
import { Card } from 'src/card/entities/card.entity';

export interface CreateCardSetDto {
  cards: Collection<Card>;
  type: string;
}
