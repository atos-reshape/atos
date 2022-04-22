import { Test, TestingModule } from '@nestjs/testing';
import { MikroORM } from '@mikro-orm/core';
import { ConfigModule } from '@nestjs/config';
import { UseDatabaseTestConfig } from '../test/helpers/database';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Lobby } from '../lobby/lobby.entity';
import { Round } from './round.entity';
import { RoundController } from './round.controller';
import { RoundService } from './round.service';
import { round, lobby, lobbyWithRound, player } from '@factories/index';
import { v4 } from 'uuid';
import { CreateRoundDto, RoundResponseDto } from './dto';
import { NotFoundException } from '@nestjs/common';
import { validate } from 'class-validator';
import { SocketService } from '../lobby/socket.service';
import { LobbyService } from '../lobby/lobby.service';
import { RoundCommand } from './round.command';
import { SelectedCards } from '../selectedCards/selectedCards.entity';
import { SelectedCardsService } from '../selectedCards/selectedCards.service';

describe('RoundController', () => {
  let socketService: SocketService;
  let controller: RoundController;
  let selectedCardsService: SelectedCardsService;
  let app: TestingModule;
  let orm: MikroORM;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        UseDatabaseTestConfig(),
        MikroOrmModule.forFeature({ entities: [Lobby, Round, SelectedCards] }),
      ],
      controllers: [RoundController],
      providers: [
        RoundService,
        SocketService,
        RoundCommand,
        LobbyService,
        SelectedCardsService,
      ],
    }).compile();

    socketService = app.get<SocketService>(SocketService);
    controller = app.get<RoundController>(RoundController);
    selectedCardsService = app.get<SelectedCardsService>(SelectedCardsService);
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
    expect(controller).toBeInstanceOf(RoundController);
  });

  describe('getRounds', () => {
    it('should return all rounds of a lobby', async () => {
      const myRound = round({ lobby: lobby({}, orm) }, orm);
      expect(await controller.getRounds(myRound.lobby.id)).toMatchObject([
        {
          id: myRound.id,
          cards: myRound.cards,
          lobbyId: myRound.lobby.id,
        } as RoundResponseDto,
      ]);
    });
  });

  describe('updateCards', () => {
    const request: CreateRoundDto = {
      cards: [v4(), v4()],
      selectableCards: 5,
    };

    describe('for an existing round', () => {
      it('should update the cards of that round', async () => {
        jest.spyOn(socketService, 'send').mockImplementation(() => undefined);

        const inactive: Lobby = lobbyWithRound({}, orm, false);
        expect(
          await controller.updateCards(inactive.currentRound.id, request),
        ).toMatchObject({ cards: request.cards } as RoundResponseDto);

        expect(socketService.send).toBeCalledWith(
          inactive.id,
          'round.updated',
          expect.any(Object),
        );
      });
    });

    describe('for an active round', () => {
      it('should return a BadRequestError', async () => {
        const active: Lobby = lobbyWithRound({}, orm);

        await expect(
          controller.updateCards(active.currentRound.id, request),
        ).rejects.toThrow('Round already started');
      });
    });

    describe('for a non existing round', () => {
      it('should return 404', async () => {
        await expect(
          controller.updateCards(v4(), request),
        ).rejects.toThrowError(NotFoundException);
      });
    });
  });

  describe('createRound', () => {
    const request: CreateRoundDto = {
      cards: [v4(), v4()],
      selectableCards: 5,
    };

    describe('for an existing lobby', () => {
      it('should create a new round and assign as current round', async () => {
        jest.spyOn(socketService, 'send').mockImplementation(() => undefined);

        const existingLobby: Lobby = lobby({}, orm);
        const p = player({}, orm);
        existingLobby.players.add(p);
        orm.em.persistAndFlush(existingLobby);
        expect(
          await controller.createRound(existingLobby.id, request),
        ).toMatchObject({ cards: request.cards } as RoundResponseDto);

        expect(socketService.send).toBeCalledWith(
          existingLobby.id,
          'round.created',
          expect.any(Object),
        );

        expect(
          await selectedCardsService.getAllSelectedCards(
            existingLobby.currentRound.id,
          ),
        ).toMatchObject([{ player: { id: p.id }, cards: [] } as SelectedCards]);
      });
    });

    describe('for an lobby with active round', () => {
      it('should return a BadRequestError', async () => {
        const active: Lobby = lobbyWithRound({}, orm);

        await expect(
          controller.createRound(active.id, request),
        ).rejects.toThrow('Lobby already has an active or prepared round');
      });
    });

    describe('for a non existing lobby', () => {
      it('should return 404', async () => {
        await expect(
          controller.createRound(v4(), request),
        ).rejects.toThrowError(NotFoundException);
      });
    });

    describe('with incorrect request body', () => {
      const request: CreateRoundDto = new CreateRoundDto({
        cards: undefined,
      });

      it('should return correct validation errors', async () => {
        expect(await validate(request)).toMatchObject([
          {
            property: 'cards',
            value: undefined,
          },
        ]);
      });
    });
  });

  describe('startRound', () => {
    describe('for an lobby with active round', () => {
      it('should return a BadRequestError', async () => {
        const active: Lobby = lobbyWithRound({}, orm);

        await expect(
          controller.startRound(active.currentRound.id),
        ).rejects.toThrow('Round already started');
      });
    });

    describe('for an lobby with inactive round', () => {
      it('should return a BadRequestError', async () => {
        const inactive: Lobby = lobbyWithRound({}, orm, false);

        expect(
          await controller.startRound(inactive.currentRound.id),
        ).toBeUndefined();

        expect(socketService.send).toBeCalledWith(
          inactive.id,
          'round.started',
          expect.any(Object),
        );
      });
    });

    describe('for a non existing lobby', () => {
      it('should return 404', async () => {
        await expect(controller.startRound(v4())).rejects.toThrowError(
          NotFoundException,
        );
      });
    });
  });

  describe('endRound', () => {
    describe('for an lobby with inactive round', () => {
      it('should return a BadRequestError', async () => {
        const inactive: Lobby = lobbyWithRound({}, orm, false);

        await expect(
          controller.endRound(inactive.currentRound.id),
        ).rejects.toThrow('Round is not active');
      });
    });

    describe('for an lobby with active round', () => {
      it('should return ok', async () => {
        const active: Lobby = lobbyWithRound({}, orm);

        expect(
          await controller.endRound(active.currentRound.id),
        ).toBeUndefined();

        expect(socketService.send).toBeCalledWith(
          active.id,
          'round.ended',
          expect.any(Object),
        );
      });
    });

    describe('for an lobby with ended round', () => {
      it('should return a BadRequestError', async () => {
        const ended: Lobby = lobbyWithRound({}, orm, true, true);

        await expect(
          controller.endRound(ended.currentRound.id),
        ).rejects.toThrow('Round is not active');
      });
    });

    describe('for a non existing lobby', () => {
      it('should return 404', async () => {
        await expect(controller.endRound(v4())).rejects.toThrowError(
          NotFoundException,
        );
      });
    });
  });
});
