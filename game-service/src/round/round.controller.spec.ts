import { Test, TestingModule } from '@nestjs/testing';
import { MikroORM } from '@mikro-orm/core';
import { ConfigModule } from '@nestjs/config';
import { UseDatabaseTestConfig } from '../test/helpers/database';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Lobby } from '../lobby/lobby.entity';
import { Round } from './round.entity';
import { RoundController } from './round.controller';
import { RoundService } from './round.service';
import { round, lobby, selectedCards, player } from '@factories/index';
import { v4 } from 'uuid';
import { CreateRoundDto, RoundResponseDto } from './dto';
import { NotFoundException } from '@nestjs/common';
import { validate } from 'class-validator';
import { SelectedCards } from '../payer/selectedCards.entity';

describe('RoundController', () => {
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
      providers: [RoundService],
    }).compile();

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
      cards: ['id-1', 'id-2'],
    };

    describe('for an existing lobby', () => {
      it('should create a new round and assign as current round', async () => {
        const existingLobby: Lobby = lobby({}, orm);
        expect(
          await controller.createRound(existingLobby.id, request),
        ).toMatchObject({ cards: request.cards } as RoundResponseDto);
      });
    });

    describe('for a non existing round', () => {
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

      // it('should return new validation error', async () => {
      //   const existingLobby: Lobby = lobby({}, orm);
      //   await expect(() =>
      //     controller.createRound(existingLobby.id, request),
      //   ).rejects.toThrow(
      //     "Value for Round.cards is required, 'undefined' found",
      //   );
      // });
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
        await controller.getPlayerSelectedCards(p.id, myRound.id),
      ).toMatchObject({
        cards: playerSelectedCards.cards,
      });
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
  });
});
