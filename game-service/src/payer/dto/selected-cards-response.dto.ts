import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Round } from '../../round/round.entity';
import { Player } from '../player.entity';

@Exclude()
export class SelectedCardsResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  round: Round;

  @ApiProperty()
  @Expose()
  player: Player;

  @ApiProperty()
  @Expose()
  cards: string[];

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;

  constructor(partial: Partial<Round>) {
    Object.assign(this, partial);
  }
}
