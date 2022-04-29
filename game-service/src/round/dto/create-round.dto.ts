import { IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoundDto {
  @ApiProperty({ type: 'array', items: { type: 'string' } })
  @IsArray()
  cards: string[] = [];

  @ApiProperty({ type: 'number', minimum: 1, default: 5 })
  selectableCards = 5;

  constructor(partial: Partial<CreateRoundDto>) {
    Object.assign(this, partial);
  }
}
