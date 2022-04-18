import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { SelectedCards } from '../selectedCards.entity';
@Exclude()
export class SelectedCardsResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  roundId: string;

  @ApiProperty()
  @Expose()
  playerId: string;

  @ApiProperty()
  @Expose()
  cards: string[];

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;

  constructor(partial: Partial<SelectedCards>) {
    Object.assign(this, partial);
    this.roundId = partial.round.id;
    this.playerId = partial.player.id;
  }
}
