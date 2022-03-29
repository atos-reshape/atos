import { EntityRepository, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCardSetDto } from './dtos/create-card-set.dto';
import { CardSet } from './entities/card-set.entity';

@Injectable()
export class CardSetService {
  constructor(
    @InjectRepository(CardSet)
    private readonly cardSetRepository: EntityRepository<CardSet>,
  ) {}

  /**
   * Retrieve all CardSets from database.
   * @param isActive - Filter on the active CardSets, if false return all CardSets including deleted ones.
   * @returns An array of CardSets.
   */
  async findAll(isActive: boolean): Promise<CardSet[]> {
    return await this.cardSetRepository.findAll({
      filters: { isActive },
    });
  }

  /**
   * Retrieve a CardSet from database.
   * @param id - The id of the CardSet to retrieve.
   * @returns The CardSet with the given id.
   */
  async findOne(id: string): Promise<CardSet> {
    return await this.cardSetRepository.findOne(id);
  }

  /**
   * Create a new CardSet in the database.
   * @param cardSet - The data to create the CardSet with.
   * @returns The created CardSet.
   */
  async create(cardSet: CreateCardSetDto): Promise<CardSet> {
    const newCardSet = this.cardSetRepository.create({
      cards: cardSet.cards,
      type: cardSet.type,
    });
    await this.cardSetRepository.persistAndFlush(newCardSet);
    return newCardSet;
  }

  /**
   * Update a CardSet in the database.
   * @param id - The id of the CardSet to update.
   * @param cardSetData - The data to update the CardSet with.
   * @returns The updated CardSet.
   */
  async update(id: string, cardSetData: CreateCardSetDto): Promise<CardSet> {
    const cardSet = await this.findOne(id);
    if (!cardSet) throw new NotFoundException('CardSet not found');
    wrap(cardSet).assign(cardSetData);
    await this.cardSetRepository.flush();

    return cardSet;
  }

  /**
   * Mark a CardSet as deleted and update it in the database.
   * @param id - The id of the CardSet to delete.
   * @returns The deleted CardSet.
   */
  async delete(id: string): Promise<void> {
    const cardSet = await this.findOne(id);
    if (!cardSet) throw new NotFoundException('CardSet not found');
    wrap(cardSet).assign({ ...cardSet, deletedAt: new Date() } as CardSet);

    return await this.cardSetRepository.flush();
  }
}
