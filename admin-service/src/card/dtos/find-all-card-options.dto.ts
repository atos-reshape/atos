import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { getAll639_1 } from 'all-iso-language-codes';
import { IsISO639_1 } from '../../helpers/is-iso-639_1.decorator';

export class FindAllCardOptionsDto {
  @ApiPropertyOptional()
  @Type(
    /* istanbul ignore next */
    () => Boolean,
  )
  @IsBoolean()
  @IsOptional()
  readonly isActive?: boolean = true;

  @ApiPropertyOptional({
    enum: ['*', ...getAll639_1()],
  })
  @Type(
    /* istanbul ignore next */
    () => String,
  )
  @IsString()
  @IsISO639_1()
  @IsOptional()
  readonly language?: string;

  @ApiPropertyOptional()
  @Type(
    /* istanbul ignore next */
    () => String,
  )
  @IsString()
  @IsOptional()
  readonly tag?: string;

  constructor(partial?: Partial<FindAllCardOptionsDto>) {
    Object.assign(this, partial);
  }
}
