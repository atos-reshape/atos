import { Module } from '@nestjs/common';
import { CardSetService } from './card-set.service';
import { CardSetController } from './card-set.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CardSet } from './entities/card-set.entity';

@Module({
  imports: [MikroOrmModule.forFeature([CardSet])],
  providers: [CardSetService],
  controllers: [CardSetController],
})
export class CardSetModule {}
