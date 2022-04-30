import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PlayerService } from '../player/player.service';
import { LobbyService } from '../lobby/lobby.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Lobby } from '../lobby/lobby.entity';
import { Player } from '../player/player.entity';
import { AuthController } from './auth.controller';
import { Round } from '../round/round.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { SocketService } from '../lobby/socket.service';
import { SelectedCards } from '../selectedCards/selectedCards.entity';
import { RoundService } from '../round/round.service';
import { SelectedCardsService } from '../selectedCards/selectedCards.service';

@Module({
  imports: [
    PassportModule,
    MikroOrmModule.forFeature([Lobby, Player, Round, SelectedCards]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PlayerService,
    LobbyService,
    JwtStrategy,
    SocketService,
    RoundService,
    SelectedCardsService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
