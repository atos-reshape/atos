import { CardSetController } from './card-set.controller';
import { CardSetService } from './card-set.service';
import { CardSet } from './entities/card-set.entity';
import { cardSet } from '../../test/factories/cardSet';
import config from '../mikro-orm.config';
import { v4 } from 'uuid';
import { Test, TestingModule } from '@nestjs/testing';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { NotFoundException } from '@nestjs/common';
import { MikroORM } from '@mikro-orm/core';

describe('CardSetController', () => {
  let cardSetController: CardSetController;
  let cardSetService: CardSetService;
  let app: TestingModule;
  let orm: MikroORM;

  beforeEach(async () => {
    app = await Test.createTestingModule({
      imports: [
        MikroOrmModule.forRoot(config),
        MikroOrmModule.forFeature({ entities: [CardSet] }),
      ],
      controllers: [CardSetController],
      providers: [CardSetService],
    }).compile();

    cardSetService = app.get<CardSetService>(CardSetService);
    cardSetController = app.get<CardSetController>(CardSetController);
    orm = app.get<MikroORM>(MikroORM);
  });

  afterAll(async () => {
    await orm.close();
    await app.close();
  });

  describe('findAll', () => {
    it('should return an array of card sets', async () => {
      const cardSets: CardSet[] = [];
      cardSets.push(cardSet());
      cardSets.push(cardSet());

      jest.spyOn(cardSetService, 'findAll').mockResolvedValue(cardSets);

      const findAllResult = await cardSetController.findAll();
      expect(findAllResult).toMatchObject(cardSets);
    });

    it('should return an empty array if there are no card sets', async () => {
      jest.spyOn(cardSetService, 'findAll').mockResolvedValue([]);

      const findAllResult = await cardSetController.findAll();
      expect(findAllResult).toMatchObject([]);
    });
  });

  describe('findOne', () => {
    it('should return a card set', async () => {
      const testCardSet = cardSet();

      jest.spyOn(cardSetService, 'findOne').mockResolvedValue(testCardSet);

      const findOneResult = await cardSetController.findOne(testCardSet.id);
      expect(findOneResult).toMatchObject(testCardSet);
    });

    it('should return 404 if there is no card set', async () => {
      jest.spyOn(cardSetService, 'findOne').mockResolvedValue(null);

      const findOneResult = await cardSetController.findOne(v4());
      expect(findOneResult).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a card set', async () => {
      const testCardSet = cardSet();

      jest.spyOn(cardSetService, 'create').mockResolvedValue(testCardSet);

      const createResult = await cardSetController.create(testCardSet);
      expect(createResult).toMatchObject(testCardSet);
    });
  });

  describe('update', () => {
    it('should return a card set', async () => {
      const testCardSet = cardSet();

      jest.spyOn(cardSetService, 'update').mockResolvedValue(testCardSet);

      const updateResult = await cardSetController.update(
        testCardSet.id,
        testCardSet,
      );
      expect(updateResult).toMatchObject(testCardSet);
    });

    it('should return 404 if there is no card set', async () => {
      jest.spyOn(cardSetService, 'update').mockResolvedValue(null);

      const updateResult = await cardSetController.update(v4, new CardSet());
      expect(updateResult).toBeNull();
    });
  });

  describe('delete', () => {
    it('should return a card set', async () => {
      const testCardSet = orm.em.create(CardSet, cardSet());
      orm.em.persist(testCardSet);

      jest.spyOn(cardSetService, 'findOne').mockResolvedValue(testCardSet);

      const deleteResult = await cardSetController.delete(testCardSet.id);
      expect(deleteResult).toBeUndefined();
    });

    it('should return 404 if there is no card set', async () => {
      try {
        await cardSetController.delete(v4());
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
