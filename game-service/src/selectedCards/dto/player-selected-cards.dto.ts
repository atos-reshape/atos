import { SelectedCardsResponseDto } from './selected-cards-response.dto';
import { SelectedCards } from '../selectedCards.entity';
import { instanceToPlain } from 'class-transformer';

export class PlayerSelectedCardsDto {
  [key: string]: SelectedCardsResponseDto;

  constructor(list: SelectedCards[]) {
    list.map(
      (selected) =>
        (this[selected.player.id] = <SelectedCardsResponseDto>(
          instanceToPlain(new SelectedCardsResponseDto(selected))
        )),
    );
  }
}
