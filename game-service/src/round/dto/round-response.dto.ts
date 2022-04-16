import { Exclude, Expose } from 'class-transformer';
import { Round } from '../round.entity';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class RoundResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  cards: string[];

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;

  @ApiProperty()
  @Expose()
  lobbyId: string;

  @ApiProperty()
  @Expose()
  startedAt: Date;

  @ApiProperty()
  @Expose()
  endedAt: Date;

  constructor(partial: Partial<Round>) {
    Object.assign(this, partial);
    this.lobbyId = partial.lobby.id;
  }
}
