import { v4 } from 'uuid';
import { Test, TestingModule } from '@nestjs/testing';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { NotFoundException } from '@nestjs/common';
import { MikroORM } from '@mikro-orm/core';
import faker from '@faker-js/faker';
import { useDatabaseTestConfig } from 'test/helpers/database';
import { CardSetController } from './card-set.controller';
import { CardSet } from './entities/card-set.entity';
import { CardSetService } from './card-set.service';
import { cardSet } from 'test/factories/cardSet';

describe('CardSetSetController', () => {
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

    // Run the migrations for testing.
    const migrator = orm.getMigrator();
    const migrations = await migrator.getPendingMigrations();

    if (migrations && migrations.length > 0) {
      await migrator.up();
    }
  });

  beforeEach(async () => {
    await orm.getSchemaGenerator().refreshDatabase();
  });

  afterAll(async () => {
    await orm.close();
    await module.close();
  });

  describe('findAll', () => {
    it('should return an array of card sets', async () => {
      const length = 5;
      const cardSets = createCardSets(new Array(length).fill({}), orm);

      const findAllResult = await CardSetController.findAll();
      expect(findAllResult).toMatchObject(cardSets);
      expect(findAllResult).toHaveLength(length);
    });

    it('should return an empty array if there are no CardSets', async () => {
      const findAllResult = await CardSetController.findAll();
      expect(findAllResult).toMatchObject([]);
    });

    it('should return only the active card sets', async () => {
      const CardSets = createCardSets([{ deletedAt: new Date() }, {}], orm);

      const findAllResult = await CardSetController.findAll();
      expect(findAllResult).toMatchObject([CardSets[1]]);
      expect(findAllResult).toHaveLength(1);
    });

    it('should return all card sets if isActive is true', async () => {
      const CardSets = createCardSets([{ deletedAt: new Date() }, {}], orm);

      const findAllResult = await CardSetController.findAll(false);
      expect(findAllResult).toMatchObject(CardSets);
      expect(findAllResult).toHaveLength(2);
    });
  });

  describe('findOne', () => {
    it('should return a CardSet', async () => {
      const testCardSet = cardSet({}, orm);

      const findOneResult = await CardSetController.findOne(testCardSet.id);
      expect(findOneResult).toMatchObject(testCardSet);
    });

    it('should return 404 if there is no CardSet', async () => {
      const findOneResult = await CardSetController.findOne(v4());
      expect(findOneResult).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a CardSet', async () => {
      const testCardSet = new CreateCardSetDto();
      testCardSet.text = faker.lorem.sentence();

      const createResult = await CardSetController.create(testCardSet);
      expect(createResult).toMatchObject(testCardSet);
    });
  });

  describe('update', () => {
    it('should return a CardSet', async () => {
      const testCardSet = cardSet({}, orm);

      const CardSetUpdate = new CreateCardSetDto();
      CardSetUpdate.text = faker.lorem.sentence();

      // Update the CardSet
      testCardSet.text = CardSetUpdate.text;
      const updateResult = await CardSetController.update(testCardSet.id, CardSetUpdate);

      expect(updateResult).toMatchObject(testCardSet);
    });

    it('should return 404 if there is no CardSet', async () => {
      const CardSetUpdate = new CreateCardSetDto();
      CardSetUpdate.text = faker.lorem.sentence();

      const nonExistingUUID = v4();

      try {
        await CardSetController.update(nonExistingUUID, CardSetUpdate);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('delete', () => {
    it('should return a CardSet', async () => {
      const testCardSet = cardSet({}, orm);

      const deleteResult = await CardSetController.delete(testCardSet.id);
      expect(deleteResult).toBeUndefined();
    });

    it('should return 404 if there is no CardSet', async () => {
      try {
        await CardSetController.delete(v4());
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
