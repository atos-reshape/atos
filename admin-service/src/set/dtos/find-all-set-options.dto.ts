import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { getAll639_1 } from 'all-iso-language-codes';
import { IsISO639_1 } from '../../helpers/is-iso-639_1.decorator';

export class FindAllSetOptionsDto {
  @ApiPropertyOptional()
  @Type(
    /* istanbul ignore next */
    () => Boolean,
  )
  @IsBoolean()
  @IsOptional()
  readonly isActive?: boolean = true;

  @ApiPropertyOptional()
  @Type(
    /* istanbul ignore next */
    () => String,
  )
  @IsString()
  @IsOptional()
  readonly tag?: string;

  constructor(partial?: Partial<FindAllSetOptionsDto>) {
    Object.assign(this, partial);
  }
}
