import { Test, TestingModule } from '@nestjs/testing';
import { MikroORM } from '@mikro-orm/core';
import { ConfigModule } from '@nestjs/config';
import { UseDatabaseTestConfig } from '../test/helpers/database';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { SelectedCards } from './selectedCards.entity';
import { SelectedCardsService } from './selectedCards.service';
import { SelectedCardsController } from './selectedCards.controller';
import { lobby, lobbyWithRound } from '@factories/lobby';
import { player } from '@factories/player';
import { round } from '@factories/round';
import { selectedCards } from '@factories/selectedCards';
import { NotFoundException } from '@nestjs/common';
import { v4 } from 'uuid';
import { SocketService } from '../lobby/socket.service';
import { SelectedCardsCommand } from './selectedCards.command';
import { RoundService } from '../round/round.service';
import { Lobby } from '../lobby/lobby.entity';
import { Round } from '../round/round.entity';

describe('SelectedCardsController', () => {
  let socketService: SocketService;
  let controller: SelectedCardsController;
  let app: TestingModule;
  let orm: MikroORM;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        UseDatabaseTestConfig(),
        MikroOrmModule.forFeature({ entities: [SelectedCards, Lobby, Round] }),
      ],
      controllers: [SelectedCardsController],
      providers: [
        SelectedCardsService,
        SocketService,
        SelectedCardsCommand,
        RoundService,
      ],
    }).compile();

    socketService = app.get<SocketService>(SocketService);
    controller = app.get<SelectedCardsController>(SelectedCardsController);
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
    expect(controller).toBeInstanceOf(SelectedCardsController);
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
      jest.spyOn(socketService, 'send').mockImplementation(() => undefined);

      const l = lobbyWithRound({}, orm);
      const p = player({ lobby: l }, orm);
      const newCard = v4();
      const playerSelectedCards = selectedCards(
        { player: p, round: l.currentRound, cards: [v4(), v4()] },
        orm,
      );
      const req = await controller.addCardToLiked(
        p.id,
        l.currentRound.id,
        newCard,
      );
      playerSelectedCards.cards.push(newCard);

      expect(socketService.send).toBeCalledWith(
        l.id,
        'cards.selected.updated',
        expect.any(Object),
      );

      expect({ cards: req.cards }).toMatchObject({
        cards: playerSelectedCards.cards,
      });
    });

    it('should return not found', async () => {
      await expect(controller.addCardToLiked(v4(), v4(), v4())).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('removeSelectedCard', () => {
    it('should remove the selected card', async () => {
      jest.spyOn(socketService, 'send').mockImplementation(() => undefined);

      const l = lobbyWithRound({}, orm);
      const p = player({ lobby: l }, orm);
      const [cards, removedCard] = [[v4(), v4()], v4()];
      selectedCards(
        { player: p, round: l.currentRound, cards: [...cards, removedCard] },
        orm,
      );

      expect(
        await controller.removeCardFromLiked(
          p.id,
          l.currentRound.id,
          removedCard,
        ),
      ).toMatchObject({ cards });

      expect(socketService.send).toBeCalledWith(
        l.id,
        'cards.selected.updated',
        expect.any(Object),
      );
    });

    it('should return not found', async () => {
      await expect(
        controller.removeCardFromLiked(v4(), v4(), v4()),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('finishedSelecting', () => {
    const playerCards = [v4(), v4(), v4(), v4()];

    describe('with correct amount of cards', () => {
      it('should finish selecting cards process', async () => {
        const l = lobbyWithRound({}, orm);
        const p = player({ lobby: l }, orm);
        const playerSelectedCards = selectedCards(
          { player: p, round: l.currentRound, cards: [...playerCards, v4()] },
          orm,
        );
        const req = await controller.finishedSelecting(p.id, l.currentRound.id);

        expect({ cards: req.cards }).toMatchObject({
          cards: playerSelectedCards.cards,
        });
      });
    });

    describe('with incorrect amount of cards', () => {
      it('should return too few selected cards for the round', async () => {
        const l = lobbyWithRound({}, orm);
        const p = player({ lobby: l }, orm);
        selectedCards(
          { player: p, round: l.currentRound, cards: [...playerCards] },
          orm,
        );

        expect(
          controller.finishedSelecting(p.id, l.currentRound.id),
        ).rejects.toThrow(Error);
      });

      it('should return too many selected cards for the round', async () => {
        const l = lobbyWithRound({}, orm);
        const p = player({ lobby: l }, orm);
        selectedCards(
          {
            player: p,
            round: l.currentRound,
            cards: [...playerCards, v4(), v4()],
          },
          orm,
        );

        await expect(
          controller.finishedSelecting(p.id, l.currentRound.id),
        ).rejects.toThrow(Error);
      });
    });
  });
});
