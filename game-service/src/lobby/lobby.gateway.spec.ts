import { LobbyGateway } from './lobby.gateway';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { UseDatabaseTestConfig } from '../test/helpers/database';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Lobby } from './lobby.entity';
import { Round } from '../round/round.entity';
import { LobbyService } from './lobby.service';
import { MikroORM } from '@mikro-orm/core';
import { lobby } from '@factories/lobby';
import { round } from '@factories/round';
import { Socket } from 'socket.io';
import { v4 } from 'uuid';
import { LobbyResponseDto } from './dto';
import { NotFoundException } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { RoundService } from '../round/round.service';
import { SelectedCardsService } from '../selectedCards/selectedCards.service';
import { SelectedCards } from '../selectedCards/selectedCards.entity';
import { Joined } from '../sockets/joined.type';
import { JwtModule } from '@nestjs/jwt';

describe('LobbyGateway', () => {
  let gateway: LobbyGateway;
  let app: TestingModule;
  let orm: MikroORM;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        JwtModule.register({
          secret: 'JWT-TEST-secret',
          signOptions: { issuer: 'game-service' },
        }),
        UseDatabaseTestConfig(),
        MikroOrmModule.forFeature({ entities: [Lobby, Round, SelectedCards] }),
      ],
      controllers: [LobbyGateway],
      providers: [LobbyService, RoundService, SelectedCardsService],
    }).compile();

    gateway = app.get<LobbyGateway>(LobbyGateway);
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
    expect(gateway).toBeDefined();
  });

  describe('joinLobby', () => {
    const socket = { join: (data: any): void => data } as Socket;

    describe('with correct lobby_id', () => {
      it('should return the lobby', async () => {
        const defaultLobby = lobby({}, orm);
        round({ lobby: defaultLobby }, orm);
        expect(await gateway.joinLobby(socket, defaultLobby.id)).toEqual(true);
      });
    });

    describe('with incorrect lobby_id', () => {
      it('should return an error message', async () => {
        await expect(gateway.joinLobby(socket, v4())).rejects.toThrowError(
          NotFoundException,
        );
      });
    });

    describe('without lobby_id', () => {
      it('should return an error message', async () => {
        await expect(gateway.joinLobby(socket, undefined)).rejects.toThrowError(
          WsException,
        );
      });
    });
  });

  describe('getLobby', () => {
    it('should return the lobby', async () => {
      const defaultLobby = lobby({}, orm);
      const socket = {
        join: (data: any): void => data,
        lobbyId: defaultLobby.id,
      } as Joined & { lobbyId: string };
      round({ lobby: defaultLobby }, orm);
      expect(await gateway.getLobby(socket)).toEqual(
        new LobbyResponseDto(defaultLobby),
      );
    });
  });
});
