import { Card } from 'src/card/entities/card.entity';
import { IsNotEmpty } from 'class-validator';

export class CreateCardSetDto {
  @IsNotEmpty()
  cards: Card[];

  @IsNotEmpty()
  type: string;
}
