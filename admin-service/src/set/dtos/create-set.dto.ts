import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateSetDto {
  @IsArray()
  @IsOptional()
  cards: string[];

  @Type(
    /* istanbul ignore next */
    () => String,
  )
  @IsString()
  @IsNotEmpty()
  name: string;

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
}
