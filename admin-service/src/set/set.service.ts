import { EntityRepository, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSetDto } from './dtos/create-set.dto';
import { Set } from './entities/set.entity';
import { PageOptionsDto } from '../dtos/page-options.dto';
import { PaginatedResult } from '../helpers/pagination.helper';
import { FindAllSetOptionsDto } from './dtos/find-all-set-options.dto';
import { TagService } from '../tag/tag.service';

@Injectable()
export class SetService {
  constructor(
    @InjectRepository(Set)
    private readonly setRepository: EntityRepository<Set>,
    private readonly tagService: TagService,
  ) {}

  /**
   * Retrieve all sets from database.
   * @param findAllOptions - The options for the query.
   * @param pageOptions - Pagination options.
   * @returns An array of sets.
   */
  async findAll(
    findAllOptions: FindAllSetOptionsDto,
    pageOptions: PageOptionsDto,
  ): Promise<PaginatedResult<Set>> {
    const { isActive, tag } = findAllOptions;

    return await this.setRepository.findAndCount(
      {},
      {
        filters: { isActive, ...(tag && { hasTag: { name: tag } }) },
        populate: ['cards'],
        limit: pageOptions.limit,
        offset: pageOptions.offset,
      },
    );
  }

  /**
   * Retrieve a set from database.
   * @param id - The id of the set to retrieve.
   * @returns The set with the given id.
   */
  async findOne(id: string): Promise<Set> {
    const set = await this.setRepository.findOne(id, {
      filters: { isActive: false },
      populate: ['cards'],
    });

    if (!set) throw new NotFoundException(`Set with id '${id}' not found.`);

    return set;
  }

  /**
   * Create a new set in the database.
   * @param set - The data to create the set with.
   * @returns The created set.
   */
  async create(set: CreateSetDto): Promise<Set> {
    if (set.tag) {
      set.tag = (await this.tagService.findOne(set.tag)).id;
    }

    const newSet = this.setRepository.create(set);
    await this.setRepository.persistAndFlush(newSet);
    return newSet;
  }

  /**
   * Update a set in the database.
   * @param id - The id of the set to update.
   * @param setData - The data to update the set with.
   * @returns The updated set.
   */
  async update(id: string, setData: CreateSetDto): Promise<Set> {
    const set = await this.findOne(id);

    if (setData.tag) {
      setData.tag = (await this.tagService.findOne(setData.tag)).id;
    }

    this.setRepository.assign(set, setData);
    await this.setRepository.flush();

    return set;
  }

  /**
   * Mark a set as deleted and update it in the database.
   * @param id - The id of the set to delete.
   * @returns The deleted set.
   */
  async delete(id: string): Promise<void> {
    const set = await this.findOne(id);
    if (set.deletedAt)
      throw new ConflictException(`Set with id ${id} already deleted`);

    wrap(set).assign({ ...set, deletedAt: new Date() } as Set);

    return await this.setRepository.flush();
  }
}
