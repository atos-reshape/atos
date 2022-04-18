import { v4 } from 'uuid';
import { Test, TestingModule } from '@nestjs/testing';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Card } from './entities/card.entity';
import { NotFoundException } from '@nestjs/common';
import {
  card,
  cardWithTranslation,
  createCards,
} from '../../test/factories/card';
import { MikroORM } from '@mikro-orm/core';
import { CreateCardDto, PageOptionsDto } from './dtos';
import { useDatabaseTestConfig } from '../../test/helpers/database';
import { Request, Response } from 'express';
import { cardTranslation } from '../../test/factories/cardTranslation';

describe('CardController', () => {
  let cardController: CardController;
  let cardService: CardService;
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
    cardService = module.get<CardService>(CardService);
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
    let request, response: Partial<Response>, responseObject;

    beforeEach(() => {
      request = {} as Request;
      response = {
        setHeader: jest.fn().mockImplementation(),
        json: jest.fn().mockImplementation((result) => {
          responseObject = result;
        }),
      };
    });

    it.each([...Array(10).keys()])(
      'should return an array of cards',
      async (length) => {
        createCards(new Array(length).fill({}), orm);
        await cardController.findAll(
          true,
          new PageOptionsDto(),
          response as Response,
          request,
        );
        expect(responseObject).toBeInstanceOf(Array);
        expect(responseObject).toHaveLength(length);
      },
    );

    it('should return an empty array if there are no cards', async () => {
      await cardController.findAll(
        true,
        new PageOptionsDto(),
        response as Response,
        request,
      );
      expect(responseObject).toBeInstanceOf(Array);
      expect(responseObject).toHaveLength(0);
      expect(responseObject).toEqual([]);
    });

    it('should return only the active cards', async () => {
      createCards([{ deletedAt: new Date() }, {}], orm);
      await cardController.findAll(
        true,
        new PageOptionsDto(),
        response as Response,
        request,
      );
      expect(responseObject).toBeInstanceOf(Array);
      expect(responseObject).toHaveLength(1);
    });

    it('should return all cards if isActive is true', async () => {
      createCards([{ deletedAt: new Date() }, {}], orm);
      await cardController.findAll(
        false,
        new PageOptionsDto(),
        response as Response,
        request,
      );
      expect(responseObject).toBeInstanceOf(Array);
      expect(responseObject).toHaveLength(2);
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
      const translation = cardTranslation({}, orm);
      const testCard = new CreateCardDto();
      testCard.translations.push(translation);

      const createResult = await cardController.create(testCard);
      expect(createResult.translations).toHaveLength(
        testCard.translations.length,
      );
    });
  });

  describe('update', () => {
    it('should return a card', async () => {
      const testCard = card({}, orm);

      const translation = cardTranslation(
        {
          card: testCard,
        },
        orm,
      );
      const cardUpdate = new CreateCardDto();
      cardUpdate.translations.push(translation);

      // Update the card
      testCard.translations.add(translation);
      const updateResult = await cardController.update(testCard.id, cardUpdate);

      expect(updateResult).toMatchObject(testCard);
    });

    it('should return 404 if there is no card', async () => {
      const nonExistingUUID = v4();

      try {
        await cardController.update(nonExistingUUID, {} as CreateCardDto);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('delete', () => {
    it('should delete a card', async () => {
      const testCard = cardWithTranslation({}, orm);

      const deleteResult = await cardController.delete(testCard.id);
      expect(deleteResult).toBeUndefined();

      const cardFromRepository = await cardService.findOne(testCard.id);
      expect(cardFromRepository.deletedAt).toBeInstanceOf(Date);
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
