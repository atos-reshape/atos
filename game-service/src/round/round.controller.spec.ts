import { Test, TestingModule } from '@nestjs/testing';
import { MikroORM } from '@mikro-orm/core';
import { ConfigModule } from '@nestjs/config';
import { UseDatabaseTestConfig } from '../test/helpers/database';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Lobby } from '../lobby/lobby.entity';
import { Round } from './round.entity';
import { RoundController } from './round.controller';
import { RoundService } from './round.service';
import {
  round,
  lobby,
  lobbyWithRound,
  selectedCards,
  player,
} from '@factories/index';
import { v4 } from 'uuid';
import { CreateRoundDto, RoundResponseDto } from './dto';
import { NotFoundException } from '@nestjs/common';
import { validate } from 'class-validator';
import { SocketService } from '../lobby/socket.service';
import { LobbyService } from '../lobby/lobby.service';
import { RoundCommand } from './round.command';
import { SelectedCards } from '../payer/selectedCards.entity';
import { SelectedCardsService } from '../payer/selectedCards.service';
import { SelectedCardsResponseDto } from '../payer/dto/selected-cards-response.dto';

describe('RoundController', () => {
  let socketService: SocketService;
  let controller: RoundController;
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

  describe('createRound', () => {
    const request: CreateRoundDto = {
      cards: [v4(), v4()],
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
          await controller.getAllSelectedCards(existingLobby.currentRound.id),
        ).toMatchObject([
          { playerId: p.id, cards: [] } as SelectedCardsResponseDto,
        ]);
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

  describe('getPlayerSelectedCards', () => {
    it('should return all the selected cards of a player', async () => {
      const l = lobby({}, orm);
      const p = player({}, orm);
      l.players.add(p);
      const myRound = round({ lobby: l }, orm);
      const playerSelectedCards = selectedCards(
        { player: p, round: myRound, cards: [v4(), v4()] },
        orm,
      );

      expect(
        await controller.getPlayerSelectedCards(myRound.id, p.id),
      ).toMatchObject({
        cards: playerSelectedCards.cards,
      });
    });

    it('should return not found', async () => {
      await expect(
        controller.getPlayerSelectedCards(v4(), v4()),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAllSelectedCards', () => {
    it('should return all the selected cards during a round', async () => {
      const l = lobby({}, orm);
      const p = player({}, orm);
      l.players.add(p);
      const myRound = round({ lobby: l }, orm);
      const playerSelectedCards = selectedCards(
        { player: p, round: myRound, cards: [v4(), v4()] },
        orm,
      );

      const findAllResult = await controller.getAllSelectedCards(myRound.id);
      expect({ selectedCards: findAllResult[0].cards }).toMatchObject({
        selectedCards: playerSelectedCards.cards,
      });
    });
  });

  describe('addSelectedCard', () => {
    it('should add the selected card', async () => {
      const l = lobby({}, orm);
      const p = player({}, orm);
      l.players.add(p);
      const myRound = round({ lobby: l }, orm);
      const newCard = v4();
      const playerSelectedCards = selectedCards(
        { player: p, round: myRound, cards: [v4(), v4()] },
        orm,
      );
      const req = await controller.addSelectedCard(p.id, myRound.id, newCard);
      playerSelectedCards.cards.push(newCard);

      expect({ cards: req.cards }).toMatchObject({
        cards: playerSelectedCards.cards,
      });
    });

    it('should return not found', async () => {
      await expect(
        controller.addSelectedCard(v4(), v4(), v4()),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeSelectedCard', () => {
    it('should remove the selected card', async () => {
      const l = lobby({}, orm);
      const p = player({}, orm);
      l.players.add(p);
      const myRound = round({ lobby: l }, orm);
      const removedCard = v4();
      const playerSelectedCards = selectedCards(
        { player: p, round: myRound, cards: [v4(), removedCard] },
        orm,
      );

      // Remove card from local selected cards
      const index = playerSelectedCards.cards.indexOf(removedCard);
      if (index > -1) {
        playerSelectedCards.cards.splice(index, 1);
      }

      expect(
        await controller.removeSelectedCard(p.id, myRound.id, removedCard),
      ).toMatchObject({
        cards: playerSelectedCards.cards,
      });
    });

    it('should return not found', async () => {
      await expect(
        controller.removeSelectedCard(v4(), v4(), v4()),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
