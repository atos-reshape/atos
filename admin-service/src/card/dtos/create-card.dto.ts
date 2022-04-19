import { ArrayNotEmpty, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CardTranslation } from '../entities/card-translation.entity';

export class CreateCardDto {
  @ApiProperty({ type: [CardTranslation] })
  @IsArray()
  @ArrayNotEmpty()
  translations: CardTranslation[] = [];
}
