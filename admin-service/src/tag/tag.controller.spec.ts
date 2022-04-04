import { v4 } from 'uuid';
import { Test, TestingModule } from '@nestjs/testing';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MikroORM } from '@mikro-orm/core';
import { useDatabaseTestConfig } from '../../test/helpers/database';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { Tag } from './entities/tag.entity';
import { createTags, tag } from '../../test/factories/tag';
import { CreateTagDto } from './dtos/create-tag.dto';
import { faker } from '@faker-js/faker';
import { NotFoundException } from '@nestjs/common';

describe('TagController', () => {
  let tagController: TagController;
  let tagService: TagService;
  let module: TestingModule;
  let orm: MikroORM;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        useDatabaseTestConfig(),
        MikroOrmModule.forFeature({ entities: [Tag] }),
      ],
      controllers: [TagController],
      providers: [TagService],
    }).compile();

    tagController = module.get<TagController>(TagController);
    tagService = module.get<TagService>(TagService);
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
    it.each([...Array(10).keys()])(
      'should return an array of tags',
      async (length) => {
        const tags = createTags(new Array(length).fill({}), orm);

        const result = await tagController.findAll();
        expect(result).toBeInstanceOf(Array);
        expect(result).toHaveLength(length);
        expect(result).toEqual(tags);
      },
    );

    it('should return an empty array if no tags are pesisted', async () => {
      const result = await tagController.findAll();
      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a tag', async () => {
      const testTag = tag({}, orm);

      const result = await tagController.findOne(testTag.id);
      expect(result).toBeInstanceOf(Tag);
      expect(result).toEqual(testTag);
    });

    it('should return null if no tag is found', async () => {
      const result = await tagController.findOne(v4());
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a tag', async () => {
      const testTag = new CreateTagDto();
      testTag.name = faker.lorem.word();

      const result = await tagController.create(testTag);
      expect(result).toBeInstanceOf(Tag);
      expect(result).toMatchObject(testTag);
    });
  });

  describe('delete', () => {
    it('should delete a tag', async () => {
      const testTag = tag({}, orm);

      const result = await tagController.delete(testTag.id);
      expect(result).toBeUndefined();

      const tagFromRepository = await tagService.findOne(testTag.id);
      expect(tagFromRepository.deletedAt).toBeInstanceOf(Date);
    });

    it('should return null if no tag is found', async () => {
      try {
        await tagController.delete(v4());
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
