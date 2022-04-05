import { Module } from '@nestjs/common';
import { RoundController } from './round.controller';
import { RoundService } from './round.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Round } from './round.entity';
import { Lobby } from '../lobby/lobby.entity';
import { RoundCommand } from './round.command';
import { SocketService } from '../lobby/socket.service';
import { LobbyService } from '../lobby/lobby.service';

@Module({
  imports: [MikroOrmModule.forFeature([Round, Lobby])],
  controllers: [RoundController],
  providers: [RoundService, RoundCommand, SocketService, LobbyService],
})
export class RoundModule {}
