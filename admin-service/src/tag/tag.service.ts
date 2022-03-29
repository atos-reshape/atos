import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { wrap } from '@mikro-orm/core';
import { Tag } from './entities/tag.entity';
import { CreateTagDto } from './dtos/create-tag.dto';

/**
 * The TagService handles all the business logic regarding a tag. Note that a
 * tag cannot be hard deleted, but instead is soft deleted. In addition, a tag
 * is immutable to make sure
 */
@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: EntityRepository<Tag>,
  ) {}

  /**
   * Retrieve all tags from database.
   * @returns An array of tags.
   */
  async findAll(): Promise<Tag[]> {
    return await this.tagRepository.findAll();
  }

  /**
   * Retrieve a tag from database.
   * @param id - The id of the tag to retrieve.
   * @returns The tag with the given id.
   */
  async findOne(id: string): Promise<Tag> {
    return await this.tagRepository.findOne(id);
  }

  /**
   * Create a new tag in the database.
   * @param tagData - The data to create the card with.
   * @returns The created card.
   */
  async create(tagData: CreateTagDto): Promise<Tag> {
    const newTag = this.tagRepository.create({ name: tagData.name });
    await this.tagRepository.persistAndFlush(newTag);
    return newTag;
  }

  /**
   * Mark a tag as deleted and update it in the database.
   * @param id - The id of the tag to delete.
   * @returns The deleted tag.
   */
  async delete(id: string): Promise<void> {
    const tag = await this.findOne(id);
    if (!tag) throw new NotFoundException('Tag not found');
    wrap(tag).assign({ ...tag, deletedAt: new Date() } as Tag);

    return await this.tagRepository.flush();
  }
}
