import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Card } from './entities/card.entity';
import { CreateCardDto, PageOptionsDto } from './dtos';
import { wrap } from '@mikro-orm/core';
import { PaginatedResult } from '../helpers/pagination.helper';
import { CardTranslation } from './entities/card-translation.entity';
import { FindAllOptionsDto } from './dtos/find-all-options.dto';
import { isValidISO639_1 } from '../helpers/is-iso-639_1.decorator';

export const ALL_TRANSLATIONS = '*';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: EntityRepository<Card>,
  ) {}

  /**
   * It flattens the response from the database to be returned to the client.
   * @param card - The card that needs to be flattened.
   * @param language - The language that needs to be used for the translation. Should be ISO 639-1.
   * @returns The flattened card.
   */
  private static flattenCard(card: Card, language?: string): Card {
    const translations = card.translations.getItems();
    const translationIndex = translations.findIndex((translation) =>
      language && translation.language
        ? translation.language === language
        : translation.isDefaultLanguage,
    );

    const flattenedCard = {
      ...card,
      // Make sure that this translation exists.
      text: translations[translationIndex].text,
    };
    delete flattenedCard.translations;

    return flattenedCard;
  }

  /**
   * Makes sure that at least and at most one translation is marked as default.
   * @param translations - The translations that need to be checked.
   */
  private static hasAtLeastAndAtMostOneDefaultLanguage(
    translations: CardTranslation[],
  ): void {
    // Make sure that at least one of the translations is set as the default.
    if (!translations.some((translation) => translation.isDefaultLanguage))
      throw new BadRequestException(
        'At least one translation must be set as default.',
      );

    // Make sure that not more than one translation is set as the default.
    if (
      translations.filter((translation) => translation.isDefaultLanguage)
        .length > 1
    )
      throw new ConflictException(
        'Only one translation can be set as default.',
      );
  }

  private static isValidLanguage(language: string): void {
    if (!isValidISO639_1(language))
      throw new BadRequestException(
        `The language '${language}' is not a valid ISO 639-1 language code.`,
      );
  }

  private static isValidLanguageOnTranslation(
    translations: CardTranslation[],
  ): void {
    translations.forEach((translation) =>
      CardService.isValidLanguage(translation.language),
    );
  }

  /**
   * Retrieve all cards from database.
   * @param findAllOptions - The options for the query.
   * @param pageOptions - Pagination options.
   * @returns An array of cards.
   */
  async findAll(
    findAllOptions: FindAllOptionsDto,
    pageOptions: PageOptionsDto,
  ): Promise<PaginatedResult<Card>> {
    const { isActive, language, tag } = findAllOptions;

    const [cards, count] = await this.cardRepository.findAndCount(
      {},
      {
        filters: { isActive, hasTag: { name: tag } },
        populate: ['translations'],
        limit: pageOptions.limit,
        offset: pageOptions.offset,
      },
    );

    // If language is *, return all translations. Otherwise, flatten the cards.
    return language === ALL_TRANSLATIONS
      ? [cards, count]
      : [
          cards
            .filter((card) =>
              card.translations.getItems().some((translation) =>
                // If language is defined, only return the translation for the given language, otherwise pick the default.
                language
                  ? translation.language === language
                  : translation.isDefaultLanguage,
              ),
            )
            .map((card) => CardService.flattenCard(card, language)),
          count,
        ];
  }

  /**
   * Retrieve a card from database.
   * @param id - The id of the card to retrieve.
   * @param language - The language that needs to be used for the translation. Should be ISO 639-1. * for all translations.
   * @returns The card with the given id.
   */
  async findOne(id: string, language?: string): Promise<Card> {
    const card = await this.cardRepository.findOne(id, {
      filters: { isActive: false },
      populate: ['translations'],
    });

    return language === ALL_TRANSLATIONS
      ? card
      : card && CardService.flattenCard(card, language);
  }

  /**
   * Create a new card in the database.
   * @param card - The data to create the card with.
   * @returns The created card.
   */
  async create(card: CreateCardDto): Promise<Card> {
    CardService.hasAtLeastAndAtMostOneDefaultLanguage(card.translations);
    CardService.isValidLanguageOnTranslation(card.translations);
    const newCard = this.cardRepository.create(card);
    await this.cardRepository.persistAndFlush(newCard);
    return newCard;
  }

  /**
   * Update a card in the database.
   * @param id - The id of the card to update.
   * @param cardData - The data to update the card with.
   * @returns The updated card.
   */
  async update(id: string, cardData: CreateCardDto): Promise<Card> {
    const card = await this.findOne(id, ALL_TRANSLATIONS);
    if (!card) throw new NotFoundException('Card not found');

    CardService.hasAtLeastAndAtMostOneDefaultLanguage(
      card.translations.getItems(),
    );
    CardService.isValidLanguageOnTranslation(card.translations.getItems());

    this.cardRepository.assign(card, cardData);
    card.translations.set(cardData.translations);
    await this.cardRepository.flush();

    return card;
  }

  /**
   * Mark a card as deleted and update it in the database.
   * @param id - The id of the card to delete.
   * @returns The deleted card.
   */
  async delete(id: string): Promise<void> {
    const card = await this.findOne(id, ALL_TRANSLATIONS);
    if (!card) throw new NotFoundException('Card not found');
    if (card.deletedAt) throw new ConflictException('Card already deleted');

    wrap(card).assign({ ...card, deletedAt: new Date() } as Card);

    return await this.cardRepository.flush();
  }
}
