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
import { SelectedCardsGateway } from './selectedCards.gateway';
import { LobbyService } from '../lobby/lobby.service';

@Module({
  imports: [MikroOrmModule.forFeature([SelectedCards, Lobby, Round])],
  controllers: [SelectedCardsController],
  providers: [
    SelectedCardsService,
    SocketService,
    RoundService,
    SelectedCardsCommand,
    SelectedCardsGateway,
    LobbyService,
  ],
})
export class SelectedCardsModule {}
