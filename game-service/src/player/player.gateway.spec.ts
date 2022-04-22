import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { UseDatabaseTestConfig } from '../test/helpers/database';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MikroORM } from '@mikro-orm/core';
import { lobby } from '@factories/lobby';
import { PlayerGateway } from './player.gateway';
import { PlayerService } from './player.service';
import { Player } from './player.entity';
import { Joined } from '../sockets/joined.type';
import { Lobby } from '../lobby/lobby.entity';
import { player } from '@factories/player';
import { PlayerResponseDto } from './dto/player-response.dto';
import { SocketService } from '../lobby/socket.service';
import { SelectedCardsService } from '../selectedCards/selectedCards.service';
import { SelectedCards } from '../selectedCards/selectedCards.entity';

describe('PlayerGateway', () => {
  let gateway: PlayerGateway;
  let app: TestingModule;
  let orm: MikroORM;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        UseDatabaseTestConfig(),
        MikroOrmModule.forFeature({ entities: [Player, Lobby, SelectedCards] }),
      ],
      controllers: [PlayerGateway],
      providers: [PlayerService, SocketService, SelectedCardsService],
    }).compile();

    gateway = app.get<PlayerGateway>(PlayerGateway);
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

  describe('getPlayers', () => {
    it('should return the players', async () => {
      const defaultLobby = lobby({}, orm);
      const socket = {
        join: (data: any): void => data,
        lobbyId: defaultLobby.id,
      } as Joined & { lobbyId: string };
      const p = player({ lobby: defaultLobby }, orm);
      expect(await gateway.getPlayers(socket)).toEqual([
        new PlayerResponseDto(p),
      ]);
    });
  });
});
