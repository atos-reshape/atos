import { IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoundDto {
  @ApiProperty({ type: 'array', items: { type: 'string' } })
  @IsArray()
  cards: string[] = [];

  constructor(partial: Partial<CreateRoundDto>) {
    Object.assign(this, partial);
  }
}