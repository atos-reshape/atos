import { v4 } from 'uuid';
import { Test, TestingModule } from '@nestjs/testing';
import { CardController } from './card.controller';
import { ALL_TRANSLATIONS, CardService } from './card.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Card } from './entities/card.entity';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import {
  card,
  cardWithTranslation,
  createCards,
  createCardsWithTranslation,
} from '../../test/factories/card';
import { MikroORM } from '@mikro-orm/core';
import { CreateCardDto, PageOptionsDto } from './dtos';
import { useDatabaseTestConfig } from '../../test/helpers/database';
import { Request, Response } from 'express';
import {
  cardTranslation,
  createCardTranslations,
} from '../../test/factories/cardTranslation';
import { tag } from '../../test/factories/tag';
import { FindAllOptionsDto } from './dtos/find-all-options.dto';
import { TagModule } from '../tag/tag.module';
import { FindOneOptionsDto } from './dtos/find-one-options.dto';

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
        TagModule,
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
    let request, response: Partial<Response>;

    beforeEach(() => {
      request = {} as Request;
      response = {
        setHeader: jest.fn().mockImplementation(),
      };
    });

    it.each([...Array(10).keys()])(
      'should return an array of cards with all translations',
      async (length) => {
        createCardsWithTranslation(
          new Array(length).fill({}),
          new Array(length).fill({}),
          orm,
        );
        const responseObject = await cardController.findAll(
          new FindAllOptionsDto({
            isActive: true,
            language: ALL_TRANSLATIONS,
            tag: undefined,
          }),
          new PageOptionsDto(),
          response as Response,
          request,
        );
        expect(responseObject).toBeInstanceOf(Array);
        expect(responseObject).toHaveLength(length);
        // Expect each object in the array to have an array called translations.
        responseObject.forEach((card) => {
          expect(card.translations.getItems()).toBeInstanceOf(Array);
        });
      },
    );

    it('should return an array of cards with the default translation', async () => {
      createCardsWithTranslation(
        [{}, {}, {}],
        [
          {
            text: 'english',
            language: 'en',
            isDefaultLanguage: false,
          },
          {
            text: 'nederlands',
            language: 'nl',
            isDefaultLanguage: true,
          },
          {
            text: 'français',
            language: 'fr',
            isDefaultLanguage: false,
          },
        ],
        orm,
      );
      const responseObject = await cardController.findAll(
        new FindAllOptionsDto({
          isActive: true,
          language: undefined,
          tag: undefined,
        }),
        new PageOptionsDto(),
        response as Response,
        request,
      );
      expect(responseObject).toBeInstanceOf(Array);
      expect(responseObject).toHaveLength(1);
      responseObject.forEach((card: Partial<Card & { text: string }>) => {
        expect(typeof card.text).toBe('string');
        expect(card.text).toBe('nederlands');
      });
    });

    it('should return an array of cards with the specified translation', async () => {
      createCardsWithTranslation(
        [{}, {}, {}],
        [
          {
            text: 'english',
            language: 'en',
            isDefaultLanguage: false,
          },
          {
            text: 'nederlands',
            language: 'nl',
            isDefaultLanguage: true,
          },
          {
            text: 'français',
            language: 'fr',
            isDefaultLanguage: false,
          },
        ],
        orm,
      );
      const responseObject = await cardController.findAll(
        new FindAllOptionsDto({
          isActive: true,
          language: 'en',
          tag: undefined,
        }),
        new PageOptionsDto(),
        response as Response,
        request,
      );
      expect(responseObject).toBeInstanceOf(Array);
      expect(responseObject).toHaveLength(1);
      // Expect each object in the array to have a field called text that is any string.
      responseObject.forEach((card: Partial<Card & { text: string }>) => {
        expect(typeof card.text).toBe('string');
        expect(card.text).toBe('english');
      });
    });

    it('should return an empty array if there are no cards', async () => {
      const responseObject = await cardController.findAll(
        new FindAllOptionsDto({
          isActive: true,
          language: ALL_TRANSLATIONS,
          tag: undefined,
        }),
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
      const responseObject = await cardController.findAll(
        new FindAllOptionsDto({
          isActive: true,
          language: ALL_TRANSLATIONS,
          tag: undefined,
        }),
        new PageOptionsDto(),
        response as Response,
        request,
      );
      expect(responseObject).toBeInstanceOf(Array);
      expect(responseObject).toHaveLength(1);
    });

    it('should return all cards if isActive is true', async () => {
      createCards([{ deletedAt: new Date() }, {}], orm);
      const responseObject = await cardController.findAll(
        new FindAllOptionsDto({
          isActive: false,
          language: ALL_TRANSLATIONS,
          tag: undefined,
        }),
        new PageOptionsDto(),
        response as Response,
        request,
      );
      expect(responseObject).toBeInstanceOf(Array);
      expect(responseObject).toHaveLength(2);
    });

    it('should return all cards that have a certain tag', async () => {
      const tagName = 'this is a tag';
      createCards(
        [
          { tag: tag({ name: tagName }) },
          { tag: tag({ name: 'a different tag' }) },
          {},
        ],
        orm,
      );
      const responseObject = await cardController.findAll(
        new FindAllOptionsDto({
          isActive: true,
          language: ALL_TRANSLATIONS,
          tag: tagName,
        }),
        new PageOptionsDto(),
        response as Response,
        request,
      );
      expect(responseObject).toBeInstanceOf(Array);
      expect(responseObject).toHaveLength(1);
      expect(responseObject[0].tag.name).toBe(tagName);
    });
  });

  describe('findOne', () => {
    it('should return a card with all translations', async () => {
      const testCard = card({}, orm);

      const findOneResult = await cardController.findOne(testCard.id, {
        language: ALL_TRANSLATIONS,
      });
      expect(findOneResult).toMatchObject(testCard);
    });

    it('should return a card with the default translation', async () => {
      const testCard = card({}, orm);

      createCardTranslations(
        [
          {
            text: 'english',
            language: 'en',
            isDefaultLanguage: false,
            card: testCard,
          },
          {
            text: 'nederlands',
            language: 'nl',
            isDefaultLanguage: true,
            card: testCard,
          },
        ],
        orm,
      );

      const findOneResult = await cardController.findOne(
        testCard.id,
        new FindOneOptionsDto(),
      );
      expect(findOneResult).toMatchObject({
        text: 'nederlands',
      });
    });

    it('should return a card with the specified translation', async () => {
      const testCard = card({}, orm);

      createCardTranslations(
        [
          {
            text: 'english',
            language: 'en',
            isDefaultLanguage: false,
            card: testCard,
          },
          {
            text: 'nederlands',
            language: 'nl',
            isDefaultLanguage: true,
            card: testCard,
          },
        ],
        orm,
      );

      const findOneResult = await cardController.findOne(testCard.id, {
        language: 'en',
      });
      expect(findOneResult).toMatchObject({
        text: 'english',
      });
    });

    it('should return null if there is no card', async () => {
      await expect(
        cardController.findOne(v4(), new FindOneOptionsDto()),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a card', async () => {
      const translation = cardTranslation({});
      const testCard = new CreateCardDto({ translations: [translation] });

      const createResult = await cardController.create(testCard);
      expect(createResult.translations).toHaveLength(
        testCard.translations.length,
      );
    });

    it('should create a card with an existing tag', async () => {
      const translation = cardTranslation({});
      const testTag = tag({ name: 'existing tag' }, orm);
      const testCard = new CreateCardDto({
        tag: testTag.name,
        translations: [translation],
      });

      const createResult = await cardController.create(testCard);
      expect(createResult.translations).toHaveLength(
        testCard.translations.length,
      );
      expect(createResult.tag.name).toBe(testTag.name);
    });

    it('should create a card with a new tag', async () => {
      const translation = cardTranslation({});
      const tagName = 'new tag';
      const testCard = new CreateCardDto({
        tag: tagName,
        translations: [translation],
      });

      const createResult = await cardController.create(testCard);
      expect(createResult.translations).toHaveLength(
        testCard.translations.length,
      );
      expect(createResult.tag.name).toBe(tagName);
    });

    it('should throw a BadRequestException if no translation is set as default', async () => {
      const testCard = new CreateCardDto();
      const translation = cardTranslation({
        card: testCard as unknown as Card,
        isDefaultLanguage: false,
      });
      testCard.translations.push(translation);

      await expect(cardController.create(testCard)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw a ConflictException if one or more translation is set as default', async () => {
      const testCard = new CreateCardDto();
      const translation = createCardTranslations([
        {
          card: testCard as unknown as Card,
          isDefaultLanguage: true,
        },
        {
          card: testCard as unknown as Card,
          isDefaultLanguage: true,
        },
      ]);
      testCard.translations.push(...translation);

      await expect(cardController.create(testCard)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw a BadRequest if the language is not ISO639-1', async () => {
      const translation = cardTranslation({
        language: 'not an ISO639-1 language code',
      });
      const testCard = new CreateCardDto();
      testCard.translations.push(translation);

      await expect(cardController.create(testCard)).rejects.toThrow(
        BadRequestException,
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

    it('should update a card with an existing tag', async () => {
      const testTag = tag({ name: 'existing tag' }, orm);
      const testCard = card({ tag: testTag }, orm);
      const translation = cardTranslation(
        {
          card: testCard,
        },
        orm,
      );
      const cardUpdate = new CreateCardDto();
      cardUpdate.translations.push(translation);
      cardUpdate.tag = testTag.name;

      // Update the card
      testCard.translations.add(translation);
      testCard.tag = testTag;
      const updateResult = await cardController.update(testCard.id, cardUpdate);

      expect(updateResult).toMatchObject(testCard);
      expect(updateResult.tag.name).toBe(testTag.name);
    });

    it('should update a card with a new tag', async () => {
      const testCard = card({}, orm);
      const tagName = 'new tag';
      const translation = cardTranslation(
        {
          card: testCard,
        },
        orm,
      );
      const cardUpdate = new CreateCardDto();
      cardUpdate.translations.push(translation);
      cardUpdate.tag = tagName;

      // Update the card
      testCard.translations.add(translation);
      const updateResult = await cardController.update(testCard.id, cardUpdate);

      expect(updateResult).toMatchObject(testCard);
      expect(updateResult.tag.name).toBe(tagName);
    });

    it('should throw NotFoundException if there is no card', async () => {
      await expect(
        cardController.update(v4(), {} as CreateCardDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw a BadRequest if the language is not ISO639-1', async () => {
      const testCard = card({}, orm);

      const translation = cardTranslation({
        language: 'not an ISO639-1 language code',
      });
      const cardUpdate = new CreateCardDto();
      cardUpdate.translations.push(translation);

      await expect(
        cardController.update(testCard.id, cardUpdate),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('delete', () => {
    it('should delete a card', async () => {
      const testCard = cardWithTranslation({}, {}, orm);

      const deleteResult = await cardController.delete(testCard.id);
      expect(deleteResult).toBeUndefined();

      const cardFromRepository = await cardService.findOne(
        testCard.id,
        new FindOneOptionsDto(),
      );
      expect(cardFromRepository.deletedAt).toBeInstanceOf(Date);
    });

    it('should throw a ConflictException if the card is already deleted', async () => {
      const testCard = card({ deletedAt: new Date() }, orm);
      await expect(cardController.delete(testCard.id)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw a NotFoundException if no card is found', async () => {
      await expect(cardController.delete(v4())).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
