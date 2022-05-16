import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

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
