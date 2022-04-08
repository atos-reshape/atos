import { v4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { MikroORM } from '@mikro-orm/core';
import { Tag } from '../../src/tag/entities/tag.entity';

export const tag = (data: Partial<Tag> = {}, orm?: MikroORM): Tag => {
  let tag = {
    id: v4(),
    name: faker.lorem.sentence(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    ...data,
  } as Tag;

  if (!!orm) {
    tag = orm.em.create(Tag, tag);
    orm.em.persist(tag);
  }

  return tag;
};

export const createTags = (
  tags: Partial<Tag>[] = [],
  orm?: MikroORM,
): Tag[] => {
  const result = tags.map((t: Partial<Tag>) => tag(t, orm));

  if (!!orm) {
    result.forEach((t) => orm.em.persist(t));
  }

  return result;
};
