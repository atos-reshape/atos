import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from './base-entity.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsISO639_1 } from '../../helpers/is-iso-639_1.decorator';
import { getAll639_1 } from 'all-iso-language-codes';

@Entity({ abstract: true })
export class BaseTranslation extends BaseEntity {
  @ApiProperty({ enum: getAll639_1() })
  @IsISO639_1()
  @Property()
  language: string;

  @ApiProperty()
  @Property()
  isDefaultLanguage: boolean;
}
