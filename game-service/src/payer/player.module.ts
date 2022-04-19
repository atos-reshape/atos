import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Player } from './player.entity';
import { Lobby } from '../lobby/lobby.entity';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';
import { SocketService } from '../lobby/socket.service';
import { SelectedCards } from './selectedCards.entity';
import { SelectedCardsService } from './selectedCards.service';
import { PlayerGateway } from './player.gateway';

@Module({
  imports: [MikroOrmModule.forFeature([Lobby, Player, SelectedCards])],
  controllers: [PlayerController],
  providers: [
    PlayerService,
    SocketService,
    SelectedCardsService,
    PlayerGateway,
  ],
})
export class PlayerModule {}
