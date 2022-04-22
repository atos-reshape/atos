import { Test, TestingModule } from '@nestjs/testing';
import { LobbyController } from './lobby.controller';
import { LobbyService } from './lobby.service';
import { Lobby } from './lobby.entity';
import { createLobbies, lobby, round } from '@factories/index';
import { MikroORM } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Round } from '../round/round.entity';
import { ConfigModule } from '@nestjs/config';
import { UseDatabaseTestConfig } from '../test/helpers/database';
import { LobbyResponseDto, CreateLobbyDto } from './dto';
import { v4 } from 'uuid';
import { NotFoundException } from '@nestjs/common';
import { validate } from 'class-validator';
import { SocketService } from './socket.service';
import { RoundService } from '../round/round.service';
import { SelectedCardsService } from '../selectedCards/selectedCards.service';
import { SelectedCards } from '../selectedCards/selectedCards.entity';

describe('LobbyController', () => {
  let controller: LobbyController;
  let app: TestingModule;
  let orm: MikroORM;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        UseDatabaseTestConfig(),
        MikroOrmModule.forFeature({ entities: [Lobby, Round, SelectedCards] }),
      ],
      controllers: [LobbyController],
      providers: [
        LobbyService,
        SocketService,
        RoundService,
        SelectedCardsService,
      ],
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
    expect(controller).toBeInstanceOf(LobbyController);
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

    describe('with non existing lobby id', () => {
      it('should return 404', async () => {
        await expect(controller.getLobby(v4())).rejects.toThrowError(
          NotFoundException,
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
    describe('with correct request body', () => {
      const request: CreateLobbyDto = {
        title: 'some-title',
        cards: ['card-id'],
        selectableCards: 5
      };

      it('should create a new lobby including a new round', async () => {
        expect(await controller.createLobby(request)).toMatchObject({
          title: request.title,
          currentRound: {
            cards: request.cards,
          },
        } as LobbyResponseDto);
      });
    });

    describe('with incorrect request body', () => {
      const request: CreateLobbyDto = new CreateLobbyDto({
        title: undefined,
        cards: ['card-id'],
      });

      it('should return correct validation errors', async () => {
        expect(await validate(request)).toMatchObject([
          {
            property: 'title',
            value: undefined,
          },
        ]);
      });

      it('should return new validation error', async () => {
        await expect(() => controller.createLobby(request)).rejects.toThrow(
          "Value for Lobby.title is required, 'undefined' found",
        );
      });
    });
  });
});
