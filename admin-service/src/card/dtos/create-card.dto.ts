import { ArrayNotEmpty, IsArray, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CardTranslation } from '../entities/card-translation.entity';
import { Type } from 'class-transformer';

export class CreateCardDto {
  @ApiProperty({ type: [CardTranslation] })
  @IsArray()
  @ArrayNotEmpty()
  readonly translations: CardTranslation[] = [];

  @ApiPropertyOptional({
    description: 'Can be either the name of the tag or the UUID of the tag.',
  })
  @Type(
    /* istanbul ignore next */
    () => String,
  )
  @IsString()
  @IsOptional()
  tag?: string;

  constructor(partial?: Partial<CreateCardDto>) {
    Object.assign(this, partial);
  }
}
