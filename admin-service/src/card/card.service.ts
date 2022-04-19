import {
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
      text: translations[translationIndex]
        ? translations[translationIndex].text
        : '',
    };
    delete flattenedCard.translations;

    return flattenedCard;
  }

  /**
   * Retrieve all cards from database.
   * @param isActive - Filter on the active cards, if false return all cards including deleted ones.
   * @param pageOptions - Pagination options.
   * @param language - The language that needs to be used for the translation. Should be ISO 639-1. * for all translations.
   * @returns An array of cards.
   */
  async findAll(
    isActive: boolean,
    pageOptions: PageOptionsDto,
    language?: string,
  ): Promise<PaginatedResult<Card>> {
    const [cards, count] = await this.cardRepository.findAndCount(
      {},
      {
        filters: { isActive },
        populate: ['translations'],
        limit: pageOptions.limit,
        offset: pageOptions.offset,
      },
    );

    // If language is *, return all translations. Otherwise, flatten the cards.
    return language === ALL_TRANSLATIONS
      ? [cards, count]
      : [cards.map((card) => CardService.flattenCard(card, language)), count];
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
      : card && CardService.flattenCard(card);
  }

  /**
   * Create a new card in the database.
   * @param card - The data to create the card with.
   * @returns The created card.
   */
  async create(card: CreateCardDto): Promise<Card> {
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
    wrap(card).assign(cardData);
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
