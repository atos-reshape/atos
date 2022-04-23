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
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { issuer: 'game-service' },
      }),
    }),
    MikroOrmModule.forFeature([Lobby, Round, SelectedCards]),
  ],
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
