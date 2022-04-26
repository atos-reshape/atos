import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { getAll639_1 } from 'all-iso-language-codes';
import { IsISO639_1 } from '../../helpers/is-iso-639_1.decorator';

export class FindOneOptionsDto {
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

  constructor(partial?: Partial<FindOneOptionsDto>) {
    Object.assign(this, partial);
  }
}
