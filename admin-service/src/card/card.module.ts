import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { Card } from './entities/card.entity';
import { TagModule } from '../tag/tag.module';
import { CsvModule } from 'nest-csv-parser';

@Module({
  imports: [CsvModule, MikroOrmModule.forFeature([Card]), TagModule],
  controllers: [CardController],
  providers: [CardService],
})
export class CardModule {}
