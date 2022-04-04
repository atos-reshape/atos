import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PageOptionsDto {
  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly offset?: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 100,
    default: 25,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  readonly limit?: number = 25;
}
