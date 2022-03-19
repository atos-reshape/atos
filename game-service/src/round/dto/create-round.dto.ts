import { IsArray } from 'class-validator';

export class CreateRoundDto {
  @IsArray()
  cards: string[] = [];
}
