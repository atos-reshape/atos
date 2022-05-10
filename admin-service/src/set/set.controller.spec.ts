import faker from '@faker-js/faker';
import { v4 } from 'uuid';
import { MikroORM, wrap } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ClassSerializerInterceptor, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { useDatabaseTestConfig } from '../../test/helpers/database';
import { SetController } from './set.controller';
import { SetService } from './set.service';
import { CreateSetDto } from './dtos/create-set.dto';
import { Set } from './entities/set.entity';
import { cardSet, createCardSets } from '../../test/factories/cardSet';
import { card } from '../../test/factories/card';

describe('CardSetController', () => {
  let cardSetController: SetController;
  let module: TestingModule;
  let orm: MikroORM;
  let cardCollection;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        useDatabaseTestConfig(),
        MikroOrmModule.forFeature({ entities: [Set] }),
      ],
      controllers: [SetController],
      providers: [SetService, ClassSerializerInterceptor],
    }).compile();

    cardSetController = module.get<SetController>(SetController);
    orm = module.get<MikroORM>(MikroORM);
    cardCollection = [card(), card()];
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
      const testCardSet = new CreateSetDto();
      testCardSet.tag = faker.lorem.sentence();
      testCardSet.name = faker.lorem.sentence();
      testCardSet.cards = cardCollection;

      const createResult = await cardSetController.create(testCardSet);

      expect(wrap(createResult).toObject()).toMatchObject(testCardSet);
    });
  });

  describe('update', () => {
    it('should return a card set', async () => {
      const testCardSet = cardSet({}, orm);

      const cardSetUpdate = new CreateSetDto();
      cardSetUpdate.tag = faker.lorem.sentence();
      cardSetUpdate.name = faker.lorem.sentence();
      cardSetUpdate.cards = [card(), card()];

      // Update the card
      testCardSet.type = cardSetUpdate.tag;
      const updateResult = await cardSetController.update(
        testCardSet.id,
        cardSetUpdate,
      );

      expect(updateResult).toMatchObject(testCardSet);
    });

    it('should return 404 if there is no card set', async () => {
      const cardSetUpdate = new CreateSetDto();
      cardSetUpdate.tag = faker.lorem.sentence();

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
