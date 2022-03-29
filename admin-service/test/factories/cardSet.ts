import { v4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { Card } from '../../src/card/entities/card.entity';
import { CardSet } from 'src/card-set/entities/card-set.entity';
import { card } from './card';
import { MikroORM } from '@mikro-orm/core';

export const cardSet = (data: Partial<CardSet> = {}, orm?: MikroORM): CardSet => {
  const cards: Card[] = [];
  for (let i = 0; i < 6; i++) {
    // let card = card({}, orm);
    cards.push();
  }

  let cardSet = {
    id: v4(),
    cardSet: cards,
    type: faker.lorem.sentence(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    ...data,
  } as CardSet;

  if (!!orm) {
    cardSet = orm.em.create(CardSet, card);
    orm.em.persist(card);
  }

  return cardSet;

};

export const createCardSets = (
  cardSets: Partial<CardSet>[] = [],
  orm?: MikroORM,
): CardSet[] => {
  const result = cardSets.map((c: Partial<CardSet>) => cardSet(c, orm));

  if (!!orm) {
    result.forEach((c) => orm.em.persist(c));
  }

  return result;
};
