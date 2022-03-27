import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PlayerService } from '../payer/player.service';
import { LobbyService } from '../lobby/lobby.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Lobby } from '../lobby/lobby.entity';
import { Player } from '../payer/player.entity';
import { AuthController } from './auth.controller';
import { Round } from '../round/round.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { issuer: 'game-service' },
      }),
    }),
    MikroOrmModule.forFeature([Lobby, Player, Round]),
  ],
  controllers: [AuthController],
  providers: [AuthService, PlayerService, LobbyService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
