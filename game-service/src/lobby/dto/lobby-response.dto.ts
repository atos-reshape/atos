import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { Lobby } from '../lobby.entity';
import { RoundResponseDto } from '../../round/dto';

@Exclude()
export class LobbyResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty({ nullable: true })
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;

  @Expose({ groups: ['withCurrentRound'] })
  @Transform(({ value }) => (value ? new RoundResponseDto(value) : null))
  currentRound: RoundResponseDto;

  constructor(lobby: Lobby) {
    Object.assign(this, lobby);
  }
}

export const responseWithCurrentRound = {
  allOf: [
    { $ref: getSchemaPath(LobbyResponseDto) },
    {
      properties: {
        currentRound: {
          $ref: getSchemaPath(RoundResponseDto),
        },
      },
    },
  ],
};
