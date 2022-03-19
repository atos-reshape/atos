import { IsArray, IsNotEmpty } from 'class-validator';

export class CreateLobbyDto {
  @IsNotEmpty()
  title: string;

  @IsArray()
  cards: string[] = [];
}
