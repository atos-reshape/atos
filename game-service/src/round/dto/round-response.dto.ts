import { Exclude, Expose } from 'class-transformer';
import { Round } from '../round.entity';

@Exclude()
export class RoundResponseDto {
  @Expose()
  id: string;
  @Expose()
  cards: string[];
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
  @Expose()
  roundId: string;

  constructor(partial: Partial<Round>) {
    Object.assign(this, partial);
    this.roundId = partial.lobby.id;
  }
}
