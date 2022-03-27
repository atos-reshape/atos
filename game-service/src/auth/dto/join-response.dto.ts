import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class JoinResponseDto {
  @ApiProperty()
  @Expose()
  lobby_id: string;

  @ApiProperty()
  @Expose()
  access_token: string;
}
