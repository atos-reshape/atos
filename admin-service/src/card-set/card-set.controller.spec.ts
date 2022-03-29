import faker from '@faker-js/faker';
import { v4 } from 'uuid';
import { MikroORM } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { useDatabaseTestConfig } from '../../test/helpers/database';
import { CardSetController } from './card-set.controller';
import { CardSetService } from './card-set.service';
import { CreateCardSetDto } from './dtos/create-card-set.dto';
import { CardSet } from './entities/card-set.entity';
import { cardSet, createCardSets } from '../../test/factories/cardSet';

describe('CardSetController', () => {
  let cardSetController: CardSetController;
  let module: TestingModule;
  let orm: MikroORM;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        useDatabaseTestConfig(),
        MikroOrmModule.forFeature({ entities: [CardSet] }),
      ],
      controllers: [CardSetController],
      providers: [CardSetService],
    }).compile();

    cardSetController = module.get<CardSetController>(CardSetController);
    orm = module.get<MikroORM>(MikroORM);
  });

  beforeEach(async () => {
    await orm.getSchemaGenerator().refreshDatabase();
  });

  afterAll(async () => {
    await module.close();
    await orm.close();
  });

  describe('findAll', () => {
    it('should return an array of card sets', async () => {
      const length = 5;
      const cards = createCardSets(new Array(length).fill({}), orm);

      const findAllResult = await cardSetController.findAll();
      expect(findAllResult).toMatchObject(cards);
      expect(findAllResult).toHaveLength(length);
    });

    it('should return an empty array if there are no card sets', async () => {
      const findAllResult = await cardSetController.findAll();
      expect(findAllResult).toMatchObject([]);
    });

    it('should return only the active card sets', async () => {
      const cards = createCardSets([{ deletedAt: new Date() }, {}], orm);

      const findAllResult = await cardSetController.findAll();
      expect(findAllResult).toMatchObject([cards[1]]);
      expect(findAllResult).toHaveLength(1);
    });

    it('should return all card sets if isActive is true', async () => {
      const cards = createCardSets([{ deletedAt: new Date() }, {}], orm);

      const findAllResult = await cardSetController.findAll(false);
      expect(findAllResult).toMatchObject(cards);
      expect(findAllResult).toHaveLength(2);
    });
  });

  describe('findOne', () => {
    it('should return a card set', async () => {
      const testCard = cardSet({}, orm);

      const findOneResult = await cardSetController.findOne(testCard.id);
      expect(findOneResult).toMatchObject(testCard);
    });

    it('should return 404 if there is no card set', async () => {
      const findOneResult = await cardSetController.findOne(v4());
      expect(findOneResult).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a card set', async () => {
      const testCardSet = new CreateCardSetDto();
      testCardSet.type = faker.lorem.sentence();

      const createResult = await cardSetController.create(testCardSet);
      expect(createResult).toMatchObject(testCardSet);
    });
  });

  describe('update', () => {
    it('should return a card set', async () => {
      const testCardSet = cardSet({}, orm);

      const cardSetUpdate = new CreateCardSetDto();
      cardSetUpdate.type = faker.lorem.sentence();

      // Update the card
      testCardSet.type = cardSetUpdate.type;
      const updateResult = await cardSetController.update(
        testCardSet.id,
        cardSetUpdate,
      );

      expect(updateResult).toMatchObject(testCardSet);
    });

    it('should return 404 if there is no card set', async () => {
      const cardSetUpdate = new CreateCardSetDto();
      cardSetUpdate.type = faker.lorem.sentence();

      const nonExistingUUID = v4();

      try {
        await cardSetController.update(nonExistingUUID, cardSetUpdate);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('delete', () => {
    it('should return a card set', async () => {
      const testCardSet = cardSet({}, orm);

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
