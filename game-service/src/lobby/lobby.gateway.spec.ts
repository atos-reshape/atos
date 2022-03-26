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

describe('LobbyGateway', () => {
  let gateway: LobbyGateway;
  let app: TestingModule;
  let orm: MikroORM;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        UseDatabaseTestConfig(),
        MikroOrmModule.forFeature({ entities: [Lobby, Round] }),
      ],
      controllers: [LobbyGateway],
      providers: [LobbyService],
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
        expect(await gateway.joinLobby(socket, defaultLobby.id)).toEqual(
          new LobbyResponseDto(defaultLobby),
        );
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
});
