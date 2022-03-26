import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { LobbyController } from './lobby.controller';
import { LobbyService } from './lobby.service';
import { Lobby } from './lobby.entity';
import { Round } from '../round/round.entity';
import { LobbyGateway } from './lobby.gateway';

@Module({
  imports: [MikroOrmModule.forFeature([Lobby, Round])],
  controllers: [LobbyController],
  providers: [LobbyService, LobbyGateway],
})
export class LobbyModule {}
