import { Collection } from '@mikro-orm/core';
import { Card } from 'src/card/entities/card.entity';
import { IsNotEmpty } from 'class-validator';

export class CreateCardSetDto {
  @IsNotEmpty()
  cards: Collection<Card>;

  @IsNotEmpty()
  type: string;
}
