import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { SelectedCards } from './selectedCards.entity';
import { SelectedCardsService } from './selectedCards.service';
import { SelectedCardsController } from './selectedCards.controller';
import { SocketService } from '../lobby/socket.service';
import { RoundService } from '../round/round.service';
import { Lobby } from '../lobby/lobby.entity';
import { Round } from '../round/round.entity';
import { SelectedCardsCommand } from './selectedCards.command';

@Module({
  imports: [MikroOrmModule.forFeature([SelectedCards, Lobby, Round])],
  controllers: [SelectedCardsController],
  providers: [
    SelectedCardsService,
    SocketService,
    RoundService,
    SelectedCardsCommand,
  ],
})
export class SelectedCardsModule {}
