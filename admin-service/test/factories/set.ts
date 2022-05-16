import { v4 } from 'uuid';
import { Set } from '../../src/set/entities/set.entity';
import { Card } from '../../src/card/entities/card.entity';
import { MikroORM } from '@mikro-orm/core';
import { faker } from '@faker-js/faker';
import { card } from './card';

export const set = (data: Partial<Set> = {}, orm?: MikroORM): Set => {
  let set = {
    id: v4(),
    name: faker.lorem.word(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    ...data,
  } as Set;

  if (!!orm) {
    set = orm.em.create(Set, set);
    orm.em.persist(set);
  }

  return set;
};

export const createSets = (
  sets: Partial<Set>[] = [],
  orm?: MikroORM,
): Set[] => {
  return sets.map((s: Partial<Set>) => set(s, orm));
};

export const setWithCard = (
  data: Partial<Set> = {},
  cardData: Partial<Card> = {},
  orm?: MikroORM,
): Set => {
  const set: Set = orm.em.create(Set, {
    id: v4(),
    name: faker.lorem.word(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    ...data,
  });

  const c: Card = card(cardData, orm);

  set.cards.add(c);
  orm.em.persistAndFlush([set, c]);

  return set;
};

export const createSetsWithCard = (
  sets: Partial<Set>[] = [],
  cards: Partial<Card>[] = [],
  orm?: MikroORM,
): Set[] => {
  return sets.map((s: Partial<Set>, index) => {
    return setWithCard(s, cards[index], orm);
  });
};
