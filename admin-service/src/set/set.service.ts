import { EntityRepository, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSetDto } from './dtos/create-set.dto';
import { Set } from './entities/set.entity';
import { PageOptionsDto } from '../dtos/page-options.dto';
import { PaginatedResult } from '../helpers/pagination.helper';
import { FindAllSetOptionsDto } from './dtos/find-all-set-options.dto';

@Injectable()
export class SetService {
  constructor(
    @InjectRepository(Set)
    private readonly cardSetRepository: EntityRepository<Set>,
  ) {}

  /**
   * Retrieve all CardSets from database.
   * @param findAllOptions - The options for the query.
   * @param pageOptions - Pagination options.
   * @returns An array of CardSets.
   */
  async findAll(
    findAllOptions: FindAllSetOptionsDto,
    pageOptions: PageOptionsDto,
  ): Promise<PaginatedResult<Set>> {
    const { isActive, tag } = findAllOptions;

    return await this.cardSetRepository.findAndCount(
      {},
      {
        filters: { isActive, ...(tag && { hasTag: { name: tag } }) },
        limit: pageOptions.limit,
        offset: pageOptions.offset,
      },
    );
  }

  /**
   * Retrieve a CardSet from database.
   * @param id - The id of the CardSet to retrieve.
   * @returns The CardSet with the given id.
   */
  async findOne(id: string): Promise<Set> {
    return await this.cardSetRepository.findOne(id);
  }

  /**
   * Create a new CardSet in the database.
   * @param cardSet - The data to create the CardSet with.
   * @returns The created CardSet.
   */
  async create(cardSet: CreateSetDto): Promise<Set> {
    const newCardSet = this.cardSetRepository.create(cardSet);
    await this.cardSetRepository.persistAndFlush(newCardSet);
    return newCardSet;
  }

  /**
   * Update a CardSet in the database.
   * @param id - The id of the CardSet to update.
   * @param cardSetData - The data to update the CardSet with.
   * @returns The updated CardSet.
   */
  async update(id: string, cardSetData: CreateSetDto): Promise<Set> {
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
    wrap(cardSet).assign({ ...cardSet, deletedAt: new Date() } as Set);

    return await this.cardSetRepository.flush();
  }
}
