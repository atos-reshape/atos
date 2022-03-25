import { Test, TestingModule } from '@nestjs/testing';
import { LobbyController } from './lobby.controller';
import { LobbyService } from './lobby.service';
import { Lobby } from './lobby.entity';
import { createLobbies, lobby, round } from '@factories/index';
import { CreateLobbyDto } from './dto/create-lobby.dto';
import { MikroORM } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import config from '../mikro-orm.config';
import { Round } from '../round/round.entity';
import { ConfigModule } from '@nestjs/config';

describe('LobbyController', () => {
  let controller: LobbyController;
  let app: TestingModule;
  let orm: MikroORM;

  beforeAll(async () => {
    console.log(process.env.DB_NAME_TEST);
    app = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        MikroOrmModule.forRoot({
          ...config,
          dbName: process.env.DB_NAME_TEST,
          password: process.env.DB_PASSWORD,
          user: process.env.DB_USER,
        }),
        MikroOrmModule.forFeature({ entities: [Lobby, Round] }),
      ],
      controllers: [LobbyController],
      providers: [LobbyService],
    }).compile();

    controller = app.get<LobbyController>(LobbyController);
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
    expect(controller).toBeDefined();
  });

  describe('getLobbies', () => {
    it('should return all lobbies', async () => {
      round({ lobby: lobby({}, orm) }, orm);
      createLobbies([{}, {}, {}], orm);
      expect(await controller.getLobbies()).toHaveLength(4);
    });
  });

  describe('getLobby', () => {
    describe('with a current round', () => {
      it('should return one specific lobby', async () => {
        const defaultLobby = lobby({}, orm);
        round({ lobby: defaultLobby }, orm);
        expect(await controller.getLobby(defaultLobby.id)).toEqual(
          defaultLobby,
        );
      });
    });

    describe('without a current round', () => {
      it('should return one specific lobby without round', async () => {
        const withoutRound = lobby({}, orm);
        expect(await controller.getLobby(withoutRound.id)).toEqual(
          withoutRound,
        );
      });
    });
  });

  describe('createLobby', () => {
    it('should create a new lobby including a new round', async () => {
      const request: CreateLobbyDto = {
        title: 'some-title',
        cards: ['card-id'],
      };
      expect(await controller.createLobby(request)).toMatchObject({
        title: request.title,
        currentRound: {
          cards: request.cards,
        },
      } as Lobby);
    });
  });
});
