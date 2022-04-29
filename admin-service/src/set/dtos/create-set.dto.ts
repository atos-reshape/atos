import { Card } from 'src/card/entities/card.entity';
import { IsNotEmpty } from 'class-validator';

export class CreateSetDto {
  @IsNotEmpty()
  cards: Card[];

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  type: string;
}
