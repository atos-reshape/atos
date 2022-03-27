import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class JoinResponseDto {
  @ApiProperty()
  @Expose()
  lobbyId: string;

  @ApiProperty()
  @Expose()
  accessToken: string;
}
