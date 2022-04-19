import { IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCardsDto {
  @ApiProperty({ type: 'array', items: { type: 'string' } })
  @IsArray()
  cards: string[] = [];
}
