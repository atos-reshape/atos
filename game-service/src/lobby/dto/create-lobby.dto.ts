import { IsArray, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLobbyDto {
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ type: 'array', items: { type: 'string' } })
  @IsArray()
  cards: string[] = [];

  @ApiProperty({ type: 'number', minimum: 1, default: 5 })
  selectableCards = 5;

  constructor(partial: Partial<CreateLobbyDto>) {
    Object.assign(this, partial);
  }
}
