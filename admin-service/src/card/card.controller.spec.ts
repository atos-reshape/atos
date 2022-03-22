import config from '../mikro-orm.config';
import { v4 } from 'uuid';
import { Test, TestingModule } from '@nestjs/testing';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Card } from './entities/card.entity';
import { NotFoundException } from '@nestjs/common';
import { card } from '../../test/factories/card';
import { MikroORM } from '@mikro-orm/core';

describe('CardController', () => {
  let cardController: CardController;
  let cardService: CardService;
  let app: TestingModule;
  let orm: MikroORM;

  beforeEach(async () => {
    app = await Test.createTestingModule({
      imports: [
        MikroOrmModule.forRoot(config),
        MikroOrmModule.forFeature({ entities: [Card] }),
      ],
      controllers: [CardController],
      providers: [CardService],
    }).compile();

    cardService = app.get<CardService>(CardService);
    cardController = app.get<CardController>(CardController);
    orm = app.get<MikroORM>(MikroORM);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('findAll', () => {
    it('should return an array of cards', async () => {
      const cards: Card[] = [];
      cards.push(card());
      cards.push(card());

      jest.spyOn(cardService, 'findAll').mockResolvedValue(cards);

      const findAllResult = await cardController.findAll();
      expect(findAllResult).toMatchObject(cards);
    });

    it('should return an empty array if there are no cards', async () => {
      jest.spyOn(cardService, 'findAll').mockResolvedValue([]);

      const findAllResult = await cardController.findAll();
      expect(findAllResult).toMatchObject([]);
    });
  });

  describe('findOne', () => {
    it('should return a card', async () => {
      const testCard = card();

      jest.spyOn(cardService, 'findOne').mockResolvedValue(testCard);

      const findOneResult = await cardController.findOne(testCard.id);
      expect(findOneResult).toMatchObject(testCard);
    });

    it('should return 404 if there is no card', async () => {
      jest.spyOn(cardService, 'findOne').mockResolvedValue(null);

      const findOneResult = await cardController.findOne(v4());
      expect(findOneResult).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a card', async () => {
      const testCard = card();

      jest.spyOn(cardService, 'create').mockResolvedValue(testCard);

      const createResult = await cardController.create(testCard);
      expect(createResult).toMatchObject(testCard);
    });
  });

  describe('update', () => {
    it('should return a card', async () => {
      const testCard = card();

      jest.spyOn(cardService, 'update').mockResolvedValue(testCard);

      const updateResult = await cardController.update(testCard.id, testCard);
      expect(updateResult).toMatchObject(testCard);
    });

    it('should return 404 if there is no card', async () => {
      jest.spyOn(cardService, 'update').mockResolvedValue(null);

      const updateResult = await cardController.update(v4, new Card());
      expect(updateResult).toBeNull();
    });
  });

  describe('delete', () => {
    it('should return a card', async () => {
      const testCard = orm.em.create(Card, card());
      orm.em.persist(testCard);

      const deleteResult = await cardController.delete(testCard.id);
      expect(deleteResult).toBeUndefined();
    });

    it('should return 404 if there is no card', async () => {
      try {
        await cardController.delete(v4());
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
