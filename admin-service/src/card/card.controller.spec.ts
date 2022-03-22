import { v4 } from 'uuid';
import { Test, TestingModule } from '@nestjs/testing';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Card } from './entities/card.entity';
import { NotFoundException } from '@nestjs/common';
import { card, createCards } from '../../test/factories/card';
import { MikroORM } from '@mikro-orm/core';
import { CreateCardDto } from './dtos/create-card.dto';
import { faker } from '@faker-js/faker';
import { useDatabaseTestConfig } from '../../test/helpers/database';

describe('CardController', () => {
  let cardController: CardController;
  let module: TestingModule;
  let orm: MikroORM;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        useDatabaseTestConfig(),
        MikroOrmModule.forFeature({ entities: [Card] }),
      ],
      controllers: [CardController],
      providers: [CardService],
    }).compile();

    cardController = module.get<CardController>(CardController);
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
    it('should return an array of cards', async () => {
      const length = 5;
      const cards = createCards(new Array(length).fill({}), orm);

      const findAllResult = await cardController.findAll();
      expect(findAllResult).toMatchObject(cards);
      expect(findAllResult).toHaveLength(length);
    });

    it('should return an empty array if there are no cards', async () => {
      const findAllResult = await cardController.findAll();
      expect(findAllResult).toMatchObject([]);
    });

    it('should return only the active cards', async () => {
      const cards = createCards([{ deletedAt: new Date() }, {}], orm);

      const findAllResult = await cardController.findAll();
      expect(findAllResult).toMatchObject([cards[1]]);
      expect(findAllResult).toHaveLength(1);
    });

    it('should return all cards if isActive is true', async () => {
      const cards = createCards([{ deletedAt: new Date() }, {}], orm);

      const findAllResult = await cardController.findAll(false);
      expect(findAllResult).toMatchObject(cards);
      expect(findAllResult).toHaveLength(2);
    });
  });

  describe('findOne', () => {
    it('should return a card', async () => {
      const testCard = card({}, orm);

      const findOneResult = await cardController.findOne(testCard.id);
      expect(findOneResult).toMatchObject(testCard);
    });

    it('should return 404 if there is no card', async () => {
      const findOneResult = await cardController.findOne(v4());
      expect(findOneResult).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a card', async () => {
      const testCard = new CreateCardDto();
      testCard.text = faker.lorem.sentence();

      const createResult = await cardController.create(testCard);
      expect(createResult).toMatchObject(testCard);
    });
  });

  describe('update', () => {
    it('should return a card', async () => {
      const testCard = card({}, orm);

      const cardUpdate = new CreateCardDto();
      cardUpdate.text = faker.lorem.sentence();

      // Update the card
      testCard.text = cardUpdate.text;
      const updateResult = await cardController.update(testCard.id, cardUpdate);

      expect(updateResult).toMatchObject(testCard);
    });

    it('should return 404 if there is no card', async () => {
      const cardUpdate = new CreateCardDto();
      cardUpdate.text = faker.lorem.sentence();

      const nonExistingUUID = v4();

      try {
        await cardController.update(nonExistingUUID, cardUpdate);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('delete', () => {
    it('should return a card', async () => {
      const testCard = card({}, orm);

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
