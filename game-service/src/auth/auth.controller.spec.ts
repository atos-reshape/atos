import { Test, TestingModule } from '@nestjs/testing';
import { MikroORM } from '@mikro-orm/core';
import { ConfigModule } from '@nestjs/config';
import { UseDatabaseTestConfig } from '../test/helpers/database';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Lobby } from '../lobby/lobby.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Player } from '../payer/player.entity';
import { Round } from '../round/round.entity';
import { PlayerService } from '../payer/player.service';
import { LobbyService } from '../lobby/lobby.service';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { lobby } from '@factories/lobby';
import { JoinResponseDto } from './dto/join-response.dto';
import { NotFoundException } from '@nestjs/common';
import { JoinLobbyDto } from './dto/join-lobby.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let app: TestingModule;
  let orm: MikroORM;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [
        PassportModule,
        JwtModule.register({
          secret: 'JWT-TEST-secret',
          signOptions: { issuer: 'game-service' },
        }),
        ConfigModule.forRoot(),
        UseDatabaseTestConfig(),
        MikroOrmModule.forFeature({ entities: [Lobby, Player, Round] }),
      ],
      controllers: [AuthController],
      providers: [AuthService, PlayerService, LobbyService, JwtStrategy],
    }).compile();

    controller = app.get<AuthController>(AuthController);
    orm = app.get<MikroORM>(MikroORM);
  });

  beforeEach(async () => {
    await orm.getSchemaGenerator().refreshDatabase();
  });

  afterAll(async () => {
    await orm.close();
    await app.close();
  });

  it('should be defined', () => {
    expect(controller).toBeInstanceOf(AuthController);
  });

  describe('joinLobby', () => {
    describe('with a valid lobby', () => {
      it('should return a valid response', async () => {
        const l = lobby({}, orm);
        expect(
          await controller.joinLobby(
            l.code,
            new JoinLobbyDto({ name: 'Random Player Name' }),
          ),
        ).toMatchObject({ lobbyId: l.id } as JoinResponseDto);
      });
    });

    describe('without a valid lobby', () => {
      it('should return a 404', async () => {
        await expect(
          controller.joinLobby(
            'code',
            new JoinLobbyDto({ name: 'Random Player Name' }),
          ),
        ).rejects.toThrowError(NotFoundException);
      });
    });

    describe('with incorrect params', () => {
      it('should return a 400', async () => {
        const l = lobby({}, orm);
        await expect(
          controller.joinLobby(l.code, new JoinLobbyDto({ name: undefined })),
        ).rejects.toThrow(
          "Value for Player.name is required, 'undefined' found",
        );
      });
    });
  });
});
