import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Card } from './entities/card.entity';
import { CreateCardDto } from './dtos/create-card.dto';
import { wrap } from '@mikro-orm/core';
import { PageOptionsDto } from './dtos/page-options.dto';
import { PaginatedResult } from '../helpers/pagination.helper';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: EntityRepository<Card>,
  ) {}

  /**
   * Retrieve all cards from database.
   * @param isActive - Filter on the active cards, if false return all cards including deleted ones.
   * @param pageOptions - Pagination options.
   *
   * @returns An array of cards.
   */
  async findAll(
    isActive: boolean,
    pageOptions: PageOptionsDto,
  ): Promise<PaginatedResult<Card>> {
    return await this.cardRepository.findAndCount(
      {},
      {
        filters: { isActive },
        limit: pageOptions.limit,
        offset: pageOptions.offset,
      },
    );
  }

  /**
   * Retrieve a card from database.
   * @param id - The id of the card to retrieve.
   * @returns The card with the given id.
   */
  async findOne(id: string): Promise<Card> {
    return await this.cardRepository.findOne(id, {
      filters: { isActive: false },
    });
  }

  /**
   * Create a new card in the database.
   * @param cardData - The data to create the card with.
   * @returns The created card.
   */
  async create(cardData: CreateCardDto): Promise<Card> {
    const newCard = this.cardRepository.create({ text: cardData.text });
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
    const card = await this.findOne(id);
    if (!card) throw new NotFoundException('Card not found');
    wrap(card).assign(cardData);
    await this.cardRepository.flush();

    return card;
  }

  /**
   * Mark a card as deleted and update it in the database.
   * @param id - The id of the card to delete.
   * @returns The deleted card.
   */
  async delete(id: string): Promise<void> {
    const card = await this.findOne(id);
    if (!card) throw new NotFoundException('Card not found');
    if (card.deletedAt) throw new ConflictException('Card already deleted');

    wrap(card).assign({ ...card, deletedAt: new Date() } as Card);

    return await this.cardRepository.flush();
  }
}
