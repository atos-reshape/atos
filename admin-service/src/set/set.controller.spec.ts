import { v4 } from 'uuid';
import { SetController } from './set.controller';
import { SetService } from './set.service';
import { Set } from './entities/set.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { MikroORM } from '@mikro-orm/core';
import { useDatabaseTestConfig } from '../../test/helpers/database';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Request, Response } from 'express';
import { TagModule } from '../tag/tag.module';
import { FindAllSetOptionsDto } from './dtos/find-all-set-options.dto';
import { PageOptionsDto } from '../dtos/page-options.dto';
import {
  createSets,
  createSetsWithCard,
  set,
  setWithCard,
} from '../../test/factories/set';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { tag } from '../../test/factories/tag';
import { CreateSetDto } from './dtos/create-set.dto';

describe('SetController', () => {
  let setController: SetController;
  let setService: SetService;
  let module: TestingModule;
  let orm: MikroORM;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        useDatabaseTestConfig(),
        MikroOrmModule.forFeature({ entities: [Set] }),
        TagModule,
      ],
      controllers: [SetController],
      providers: [SetService],
    }).compile();

    setController = module.get<SetController>(SetController);
    setService = module.get<SetService>(SetService);
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
      'should return an array of sets without cards',
      async (length: number) => {
        const sets = createSets(new Array(length).fill({}), orm);

        const responseObject = await setController.findAll(
          new FindAllSetOptionsDto({
            isActive: true,
            tag: undefined,
          }),
          new PageOptionsDto(),
          response as Response,
          request,
        );
        expect(responseObject).toBeInstanceOf(Array);
        expect(responseObject).toHaveLength(length);
        expect(responseObject).toStrictEqual(sets);
      },
    );

    it('should return an empty array if no sets are persisted', async () => {
      const responseObject = await setController.findAll(
        new FindAllSetOptionsDto({
          isActive: true,
          tag: undefined,
        }),
        new PageOptionsDto(),
        response as Response,
        request,
      );
      expect(responseObject).toBeInstanceOf(Array);
      expect(responseObject).toHaveLength(0);
      expect(responseObject).toStrictEqual([]);
    });

    it.each([...Array(10).keys()])(
      'should return an array of set with all cards',
      async (length: number) => {
        createSetsWithCard(
          new Array(length).fill({}),
          new Array(length).fill({}),
          orm,
        );
        const responseObject = await setController.findAll(
          new FindAllSetOptionsDto({
            isActive: true,
            tag: undefined,
          }),
          new PageOptionsDto(),
          response as Response,
          request,
        );
        expect(responseObject).toBeInstanceOf(Array);
        expect(responseObject).toHaveLength(length);
        // Expect each object in the array to have an array called cards.
        responseObject.forEach((set: Set) => {
          expect(set.cards.getItems()).toBeInstanceOf(Array);
        });
      },
    );

    it('should return only the active sets', async () => {
      createSets([{ deletedAt: new Date() }, {}], orm);
      const responseObject = await setController.findAll(
        new FindAllSetOptionsDto({
          isActive: true,
          tag: undefined,
        }),
        new PageOptionsDto(),
        response as Response,
        request,
      );
      expect(responseObject).toBeInstanceOf(Array);
      expect(responseObject).toHaveLength(1);
    });

    it('should return all sets if isActive is true', async () => {
      createSets([{ deletedAt: new Date() }, {}], orm);
      const responseObject = await setController.findAll(
        new FindAllSetOptionsDto({
          isActive: false,
          tag: undefined,
        }),
        new PageOptionsDto(),
        response as Response,
        request,
      );
      expect(responseObject).toBeInstanceOf(Array);
      expect(responseObject).toHaveLength(2);
    });

    it('should return all sets that have a certain tag', async () => {
      const tagName = 'this is a tag';
      createSets(
        [
          { tag: tag({ name: tagName }) },
          { tag: tag({ name: 'a different tag' }) },
          {},
        ],
        orm,
      );
      const responseObject = await setController.findAll(
        new FindAllSetOptionsDto({
          isActive: true,
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
    it('should return a set with all cards', async () => {
      const testSet = set({}, orm);

      const findOneResult = await setController.findOne(testSet.id);
      expect(findOneResult).toMatchObject(testSet);
    });

    it('should return null if there is no set', async () => {
      await expect(setController.findOne(v4())).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create a set', async () => {
      const testSet = new CreateSetDto({
        name: 'test set',
      });

      const createResult = await setController.create(testSet);
      expect(createResult).toMatchObject(testSet);
    });

    it('should create a set with an existing tag as UUID', async () => {
      const testTag = tag({ name: 'existing tag' }, orm);
      const testSet = new CreateSetDto({
        name: 'test set',
        tag: testTag.id,
      });

      const createResult = await setController.create(testSet);
      expect(createResult.tag.name).toBe(testTag.name);
    });

    it('should throw a NotFoundException when creating a set with a new tag', async () => {
      const tagName = 'new tag';
      const testSet = new CreateSetDto({
        name: 'test set',
        tag: tagName,
      });

      await expect(setController.create(testSet)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should return a set', async () => {
      const testSet = set({}, orm);

      const setUpdate = new CreateSetDto({
        name: 'updated set',
      });

      // Update the set
      const updateResult = await setController.update(testSet.id, setUpdate);

      expect(updateResult).toMatchObject(testSet);
    });

    it('should update a set with an existing tag as UUID', async () => {
      const testTag = tag({ name: 'existing tag' }, orm);
      const testSet = set({ tag: testTag }, orm);
      const setUpdate = new CreateSetDto();
      setUpdate.tag = testTag.id;

      // Update the set
      testSet.tag = testTag;
      const updateResult = await setController.update(testSet.id, setUpdate);

      expect(updateResult).toMatchObject(testSet);
      expect(updateResult.tag.name).toBe(testTag.name);
    });

    it('should throw a NotFoundException when updating a set with a new tag', async () => {
      const testSet = set({}, orm);
      const tagName = 'new tag';
      const setUpdate = new CreateSetDto();
      setUpdate.tag = tagName;

      // Update the set
      await expect(setController.update(testSet.id, setUpdate)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if there is no set', async () => {
      await expect(
        setController.update(v4(), {
          name: 'test set',
        } as CreateSetDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a set', async () => {
      const testSet = setWithCard({}, {}, orm);

      const deleteResult = await setController.delete(testSet.id);
      expect(deleteResult).toBeUndefined();

      const setFromRepository = await setService.findOne(testSet.id);
      expect(setFromRepository.deletedAt).toBeInstanceOf(Date);
    });

    it('should throw a ConflictException if the set is already deleted', async () => {
      const testSet = set({ deletedAt: new Date() }, orm);
      await expect(setController.delete(testSet.id)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw a NotFoundException if no set is found', async () => {
      await expect(setController.delete(v4())).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
