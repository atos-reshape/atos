import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { LobbyController } from './lobby.controller';
import { LobbyService } from './lobby.service';
import { Lobby } from './lobby.entity';
import { Round } from '../round/round.entity';
import { LobbyGateway } from './lobby.gateway';
import { SocketService } from './socket.service';
import { RoundService } from '../round/round.service';
import { SelectedCardsService } from '../selectedCards/selectedCards.service';
import { SelectedCards } from '../selectedCards/selectedCards.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Lobby, Round, SelectedCards])],
  controllers: [LobbyController],
  providers: [
    LobbyService,
    LobbyGateway,
    SocketService,
    RoundService,
    SelectedCardsService,
  ],
})
export class LobbyModule {}
