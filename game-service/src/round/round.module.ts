import { Module } from '@nestjs/common';
import { RoundController } from './round.controller';
import { RoundService } from './round.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Round } from './round.entity';
import { Lobby } from '../lobby/lobby.entity';
import { SelectedCards } from '../payer/selectedCards.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Round, Lobby, SelectedCards])],
  controllers: [RoundController],
  providers: [RoundService],
})
export class RoundModule {}
