import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class JoinLobbyDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  constructor(partial: Partial<JoinLobbyDto>) {
    Object.assign(this, partial);
  }
}
