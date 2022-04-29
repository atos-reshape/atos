import { v4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { Card } from '../../src/card/entities/card.entity';
import { MikroORM } from '@mikro-orm/core';
import { Set } from '../../src/set/entities/card-set.entity';
import { card } from './card';

export const cardSet = (data: Partial<Set> = {}, orm?: MikroORM): Set => {
  const cards: Card[] = [card(), card()];

  let cardSet = {
    id: v4(),
    cardSet: cards,
    type: faker.lorem.sentence(),
    name: faker.lorem.sentence(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    ...data,
  } as Set;

  if (!!orm) {
    cardSet = orm.em.create(Set, cardSet);
    orm.em.persist(cardSet);
  }

  return cardSet;
};

export const createCardSets = (
  cardSets: Partial<Set>[] = [],
  orm?: MikroORM,
): Set[] => {
  const result = cardSets.map((c: Partial<Set>) => cardSet(c, orm));

  if (!!orm) {
    result.forEach((c) => orm.em.persist(c));
  }

  return result;
};
